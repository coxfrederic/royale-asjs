/**
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

goog.provide('org_apache_flex_binding_WatcherBase');



/**
 * @constructor
 */
org_apache_flex_binding_WatcherBase = function() {

  /**
     * @protected
     * @type {Object}
     */
  this.listeners = null;

  /**
     * @protected
     * @type {Object}
     * Children of this watcher are watching sub values.
     */
  this.children = null;

};


/**
 * Metadata
 *
 * @type {Object.<string, Array.<Object>>}
 */
org_apache_flex_binding_WatcherBase.prototype.FLEXJS_CLASS_INFO =
    { names: [{ name: 'WatcherBase',
                qName: 'org_apache_flex_binding_WatcherBase'}] };


/**
 *  @expose
 *  @type {Object|number|string|boolean}
 *  The value itself.
 */
org_apache_flex_binding_WatcherBase.prototype.value = null;


/**
 *  @expose
 *  This is an abstract method that subclasses implement.
 *  @this {org_apache_flex_binding_WatcherBase}
 *  @param {Object} parent The new parent.
 */
org_apache_flex_binding_WatcherBase.prototype.parentChanged =
    function(parent) {
};


/**
 *  @expose
 *  Add a child to this watcher, meaning that the child
 *  is watching a sub value of ours.
 *  @this {org_apache_flex_binding_WatcherBase}
 *  @param {Object} child The new child.
 */
org_apache_flex_binding_WatcherBase.prototype.addChild =
    function(child) {
  if (!this.children)
    this.children = [child];
  else
    this.children.push(child);

  child.parentChanged(this.value);
};


/**
 *  @expose
 *  Add a binding to this watcher, meaning that the binding
 *  is notified when our value changes.
 *  @this {org_apache_flex_binding_WatcherBase}
 *  @param {Object} binding The new binding.
 */
org_apache_flex_binding_WatcherBase.prototype.addBinding =
    function(binding) {
  if (!this.listeners)
    this.listeners = [binding];
  else
    this.listeners.push(binding);

  binding.valueChanged(this.value);
};


/**
 *  @expose
 *  @this {org_apache_flex_binding_WatcherBase}
 *  We have probably changed, so go through
 *  and make sure our children are updated.
 */
org_apache_flex_binding_WatcherBase.prototype.updateChildren = function() {
  if (this.children)
  {
    var n = this.children.length;
    for (var i = 0; i < n; ++i)
    {
      this.children[i].parentChanged(this);
    }
  }
};


/**
 *  @protected
 *  @this {org_apache_flex_binding_WatcherBase}
 *  @param {Object} oldValue The prior value.
 *  @return {boolean} True if value changed.
 */
org_apache_flex_binding_WatcherBase.prototype.valueChanged =
    function(oldValue) {

  if (oldValue == null && this.value == null)
    return false;

  var valType = typeof(this.value);

  // The first check is meant to catch the delayed instantiation case
  // where a control comes into existence but its value is still
  // the equivalent of not having been filled in.
  // Otherwise we simply return whether the value has changed.

  if (valType == 'string')
  {
    if (oldValue == null && this.value === '')
      return false;
    else
      return oldValue != this.value;
  }

  if (valType == 'number')
  {
    if (oldValue == null && this.value === 0)
      return false;
    else
      return oldValue != this.value;
  }

  if (valType == 'boolean')
  {
    if (oldValue == null && this.value === false)
      return false;
    else
      return oldValue != this.value;
  }

  return true;
};


/**
 *  @protected
 *  @this {org_apache_flex_binding_WatcherBase}
 *  @param {function(?): ?} wrappedFunction The function to call.
 */
org_apache_flex_binding_WatcherBase.prototype.wrapUpdate =
    function(wrappedFunction) {
  try
  {
    wrappedFunction.apply(this);
  }
  catch (error)
  {
    var staticClass = org_apache_flex_binding_WatcherBase;
    var n = staticClass.allowedErrorTypes.length;
    for (var i = 0; i < n; i++)
    {
      if (org_apache_flex_utils_Language.is(error, staticClass.allowedErrorTypes[i].type))
      {
        var handler = staticClass.allowedErrorTypes[i].handler;
        if (handler != null)
          this.value = handler(this, wrappedFunction);
        else
          this.value = null;
      }
    }

    if (error.errorID && staticClass.allowedErrors.indexOf(error.errorID) == -1) {
      throw error;
    }
  }
};


/**
 * Certain errors are normal when executing an update, so we swallow them:
 */
org_apache_flex_binding_WatcherBase.allowedErrors = [
  1006, //   Error #1006: Call attempted on an object
  //                that is not a function.
  1009, //   Error #1009: null has no properties.
  1010, //   Error #1010: undefined has no properties.
  1055, //   Error #1055: - has no properties.
  1069, //   Error #1069: Property - not found on - and
  //                there is no default value
  1507 //   Error #1507: - invalid null argument.
];


/**
 * Certain types of errors are normal when executing an update,
 * so we custom handle them or swallow them:
 */
org_apache_flex_binding_WatcherBase.allowedErrorTypes = [
  { type: RangeError /*,
              handler: function(w:WatcherBase,
                    wrappedFunction:Function):Object { return null }*/
  }
];


/**
 *  @protected
 *  @this {org_apache_flex_binding_WatcherBase}
 */
org_apache_flex_binding_WatcherBase.prototype.notifyListeners = function()
    {
  if (this.listeners)
  {
    var n = this.listeners.length;

    for (var i = 0; i < n; i++)
    {
      this.listeners[i].valueChanged(this.value);
    }
  }
};
