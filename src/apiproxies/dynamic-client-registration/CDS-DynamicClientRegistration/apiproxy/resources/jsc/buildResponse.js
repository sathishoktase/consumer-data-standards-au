 /*
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     https://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

/**
 * @file
 * buildResponse.js
 * Build the response for creating, updating or getting a client
 * Response is based on the registrationInfo stored as a custom attribute in the Apigee App created for the client
 */
 var regInfo = JSON.parse(context.getVariable("registrationInfo"));
 var SSA = context.getVariable("SSA");
 // Find the SSA & RegInfo stored as a custom attribute.
 
//  for (var i = 0; i < apigeeAppResponse.attributes.length; i++) {
//      curAttr = apigeeAppResponse.attributes[i];
//      if (curAttr.name == "RegistrationInfo") {
//          regInfo = JSON.parse(curAttr.value);
//      }
//      else if (curAttr.name == "SSA") {
//          SSA = curAttr.value;
//      }
//  }
 
 var theResponse = regInfo;
 // Add SSA, client id, and when it was created/modified. Return the client_id generated by the OIDC provider (if app is being created) or the client_id associated with the token in get/update client registration operation
 theResponse.software_statement = SSA;
 if (context.getVariable("request.verb") == "POST") {
    // If client has just been registered, client_id will be available  as part of the OIDC provider
    // Also make sure response code is 201 Created
    theResponse.client_id = context.getVariable("theNewAppId");
    context.setVariable("response.status.code",201);
    context.setVariable("response.reason.phrase", "Created");
 }
 else {
    theResponse.client_id = context.getVariable("clientIdFromToken");
 }
 
 theResponse.client_id_issued_at = context.getVariable("clientIssuedAt");
 context.setVariable("response.content", JSON.stringify(theResponse));
 