import mongoose from "mongoose";
import { Password } from "../services/password";

// An interface that describe the properties of a new user
interface UserAttrs {
  email: string;
  password: string;
}

// an intereface that describes the properties that a User Model have
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): any;
}

// an intereface that describes the properties that a User Documents have
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      // this the method to run when user want to turn whne user stringify function or turn in to objects to send to the client

      transform(doc, ret) {
        // transform function enable to reform the data based on the format we want
        ret.id = ret._id; // mongodb return _id, we change it back to id so we can have consistent id fetch back to client
        delete ret._id; // delete - remove the property when send back to client
        delete ret.password;
        delete ret.__v;

        // When send the json objects to client, remove the password property and __v
      },
    },
  }
);

// middleware function, no arrow function needed, we need to call done() when the task is finsihed
// we dont use arrow function because 'this' in the function will reflect the user Document
userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    // future implementation if we want to change the email but keep teh same password
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed); // update the password
  }
  done(); // done all the async work
});

// Instead of creating new User like the normal way, since we are using typescript, we need to use a function to create new user in order to check type using typescript
// Get a custom Function build into a model so we dont have export it seperately, allow to call User.build({object})

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema); // <> generic syntax for type to a function as arguments

//Create a new user example
// const user = User.build({
//   email: "test@test.com",
//   password: " jhdsads",
// });

export { User };
