/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
FalconJX will inject html into the index.html file.  Surround with
"inject_html" tag as follows:

<inject_html>
<link rel="stylesheet"
    href="http://code.jquery.com/ui/1.10.2/themes/smoothness/jquery-ui.css" />
<script src="http://code.jquery.com/jquery-1.9.1.js"></script>
<script src="http://code.jquery.com/ui/1.10.2/jquery-ui.js"></script>
</inject_html>
*/

goog.provide('org_apache_flex_jquery_Application');

goog.require('org_apache_flex_core_Application');



/**
 * @constructor
 * @extends {org_apache_flex_core_Application}
 */
org_apache_flex_jquery_Application = function() {
  org_apache_flex_jquery_Application.base(this, 'constructor');
};
goog.inherits(org_apache_flex_jquery_Application,
    org_apache_flex_core_Application);

