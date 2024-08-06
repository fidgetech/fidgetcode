/*********************************************
REQUIRED CONFIGURATION
Set env variables in `functions/.env`. (See `.env.example` for an example.)
*********************************************/

import { updateAssignmentStatus } from './submission.js';
import { githubWebhook } from './githubWebhook.js';
import { githubFetchOnCall } from './githubFetch.js';
import { templateUpdated } from './templateUpdated.js';
import { addUser } from './addUser.js';

export { updateAssignmentStatus, githubWebhook, githubFetchOnCall, templateUpdated, addUser };
