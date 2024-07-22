/*********************************************
REQUIRED CONFIGURATION
Set env variables in `functions/.env`. (See `.env.example` for an example.)
*********************************************/

import { updateAssignmentStatus } from './submission.js';
import { githubWebhook } from './githubWebhook.js';

export { updateAssignmentStatus, githubWebhook };
