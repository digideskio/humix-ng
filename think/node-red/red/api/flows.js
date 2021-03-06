/**
 * Copyright 2014, 2015 IBM Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

var log = require("../log");

var redNodes = require("../nodes");
var settings = require("../settings");

module.exports = {
    get: function(req,res) {
        log.audit({event: "flows.get"},req);
        res.json(redNodes.getFlows());
    },
    post: function(req,res) {
        var flows = req.body;
        var deploymentType = req.get("Node-RED-Deployment-Type")||"full";
        log.audit({event: "flows.set",type:deploymentType},req);
        redNodes.setFlows(flows,deploymentType).then(function() {
            res.send(204);
        }).otherwise(function(err) {
            log.warn(log._("api.flows.error-save",{message:err.message}));
            log.warn(err.stack);
            res.json(500,{error:"unexpected_error", message:err.message});
        });
    }
}
