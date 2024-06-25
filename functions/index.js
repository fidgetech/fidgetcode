/*********************************************
REQUIRED CONFIGURATION (RUN FROM FUNCTIONS DIR)
firebase functions:config:set email.sendgrid_api key="your_sendgrid_api_key"
firebase functions:config:set email.from="your_email_address"
firebase functions:config:set github.secret="your_github_webhook_secret"

FOR TESTING WITH FIREBASE EMULATOR (RUN FROM FUNCTIONS DIR):
firebase functions:config:get > .runtimeconfig.json
*********************************************/

import { updateAssignmentStatus } from './submission.js';
import { githubWebhook } from './githubWebhook.js';

export { updateAssignmentStatus, githubWebhook };
