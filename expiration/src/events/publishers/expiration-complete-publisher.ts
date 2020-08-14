import { Subjects, Publisher, ExpirationCompleteEvent } from '@edticketing/common'


export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>  {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete
}