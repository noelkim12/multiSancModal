/**
 * JAVASCRIPT LIBRARY BY NOEL
 * ----------------------------------------------------
 *
 * @Author NOEL
 */
(function() {
    Array.prototype.first = function(){
        return this[0];
    };
    Array.prototype.last = function(){
        return this[this.length - 1];
    };
    Array.prototype.lastIdx = function(){
        return this.length - 1;
    };
    Array.prototype.beforeLast = function(){
        return this[this.length - 2];
    };
    Array.prototype.modifyLast = function(arg){
        this[this.length - 1] = arg;
    };
    Array.prototype.groupByArr = function(predicate) {

        return Object.entries(this.reduce((result, value) => {
            let group = value[predicate];

            if ("function" === typeof predicate) {
                group = predicate(value);
            }

            if (result[group] === undefined) {
                result[group] = [];
            }
            result[group].push(value);
            return result;
        }, Object.setPrototypeOf({}, {grouped : true}))).map(_group => _group[1]);
    }
    Array.prototype.groupBy = function(predicate) {
        return this.reduce((result, value) => {
            let group = value[predicate];

            if ("function" === typeof predicate) {
                group = predicate(value);
            }

            if (result[group] === undefined) {
                result[group] = [];
            }

            result[group].push(value);
            return result;
        }, Object.setPrototypeOf({}, {grouped : true}));
    }
    HTMLElement.prototype.qs = HTMLElement.prototype.querySelector;
    HTMLElement.prototype.qsa = HTMLElement.prototype.querySelectorAll;
    HTMLElement.prototype.empty = function() {
        this.innerHTML = "";
    };
    HTMLElement.prototype.cleanAppend = function(..._els) {
        this.empty();
        _els.forEach(_el => {
            this.append(_el);
        })
    };
    HTMLDocument.prototype.qs = HTMLDocument.prototype.querySelector;
    HTMLDocument.prototype.qsa = HTMLDocument.prototype.querySelectorAll;
    HTMLFormElement.prototype.toFormData = function() {
        return new FormData(this);
    }
})()

window.$N = (function () {
    "use strict";
    return {
        /**
         * Create HTML Document Element
         * @function elCreator
         * @param {Object} attribute
         *     -> @required @param {String, String} tagName-value 생성할 HTML태그명
         *     -> @param {Map<String,Obejct>} key-value HTML 속성명, 속성 인자
         *     -> @param {Array|Object} children 생성한 Element에 추가될 Children
         * @example $N.elCreator({ tagName : 'table'
         , class: 'tbl-list'
         , style: 'dislpay: inline;'
         , children : [
         { tagName : 'th', text: 'test1' }
         , { tagName : 'th', text: 'test2' }
         ]
         })
         */
        el : function(tagName, attribute) {

            attribute = attribute || {};

            attribute.tagName = tagName;

            return $N.elCreator(attribute);
        },
        elCreator : function(attribute) {

            if ( this.isEmpty(attribute) ) {
                console.error('NO ATTRIBUTE EXCEPTION');
                return;
            }
            if ( this.isString(attribute) ) attribute = { tagName : attribute };
            if ( this.isEmpty(attribute.tagName) ) {
                console.log(attribute)
                console.error('NO TAG NAME INCLUDED IN ATTRIBUTE');
                return;
            }

            let tagName = attribute.tagName;
            let el = document.createElement(tagName);

            $.each(attribute, function(k, v) {
                k = k.toLowerCase();
                if ( k === 'text' )
                    el.innerText = v;
                else if ( k === 'html' )
                    el.innerHTML = v;
                else if ( k === 'value' )
                    el.value = v;
                else if ( k === 'children' ) {

                    if ( $N.isArray(v) ) {
                        v.forEach(function(childObj, idx) {
                            let childEl = $N.elCreator(childObj);
                            el.appendChild(childEl);
                        })
                    }
                    if ( $N.isObject(v) ) {
                        let childEl = $N.elCreator(v);
                        el.appendChild(childEl);
                    }
                }
                else if ( k === 'tagname' ) {

                }
                else
                    el.setAttribute(k, v);
            })

            el.__proto__.setId = function(arg) { this.setAttribute("id", arg) }
            el.__proto__.setName = function(arg) { this.setAttribute("name", arg) }
            el.__proto__.setClass = function(arg) { this.setAttribute("class", arg) }
            el.__proto__.setText = function(arg) { this.innerText = arg }
            el.__proto__.setHTML = function(arg) { this.innerHTML = arg }
            el.__proto__.setValue = function(arg) { this.value = arg }

            return el;
        },
        /**
         * HELP MAKING VALID EL CREATOR FORM
         * @function elCreatorHelper
         * @param {String} selector
         * @returns {Object}
         */
        tagObj : function(tagName, additional) {
            return Object.assign({"tagName" : tagName}, additional);
        },
        elCreatorHelper : function(selector, isTagName) {

            let attributes = {}, domEl;

            if ( isTagName ) $N.elCreatorHelper($N.el(selector));

            if ( !$N.isString(selector) && !$N.isHtml(selector) ) throw new Error('ARG IS INVALID FOR THIS FUNCTION');

            if ( $N.isString(selector))
                domEl = document.querySelector(selector);
            if ( $N.isHtml(selector) )
                domEl = selector;

            if ( $N.isNotEmpty(domEl) ) {
                let nodeName = domEl?.nodeName,
                    rawAttr = domEl?.attributes,
                    keys = Object.keys(rawAttr);

                attributes['tagName'] = nodeName;

                if ( $N.isNotEmpty(keys) ) {
                    keys.forEach(function(k) {
                        try {
                            if ( $N.isNotEmpty(rawAttr[k].name) )
                                attributes[rawAttr[k].name] = rawAttr[k].value
                        }
                        catch(e) {}
                    })
                };


                for ( let i = 0; i < domEl.childNodes.length; i++ ) {
                    let cnode = domEl.childNodes[i];

                    if ( $N.checkType(cnode, 'text') ) {
                        let txt = cnode.data.trim();
                        if ( $N.isNotEmpty(txt) ) attributes["text"] = txt;
                    }
                }

                let childrenArr = [];

                for ( let i = 0; i < domEl.children.length; i++ ) {
                    let childObj = $N.elCreatorHelper(domEl.children[i]);
                    if ( $N.isNotEmpty(childObj)) childrenArr.push(childObj);
                }

                if ( $N.isNotEmpty(childrenArr) ) {
                    attributes["children"] = childrenArr;
                }

                return attributes;
            }
        },
        /**
         * createHTMLElementNode with raw HTML String
         * @param rawHTML
         * @returns {HTMLElement}
         */
        createHTMLElementNode : function(rawHTML) {
            let tempItem = document.createElement("template")
            tempItem.innerHTML = rawHTML;
            let childNodes = [...tempItem.content.childNodes]
            return childNodes?.length === 1 ? childNodes[0] : childNodes.length === 0 ? null : childNodes;
        },
        /**
         * createHTMLElementNode with raw HTML String
         * @param rawHTML
         * @returns {HTMLElement}
         */
        createHTMLElement : function(rawHTML) {
            let tempItem = document.createElement("template")
            tempItem.innerHTML = rawHTML;
            let tChildren = [...tempItem.content.children]
            return tChildren?.length === 1 ? tChildren[0] : tChildren.length === 0 ? null : tChildren;
        },

        /**
         *
         * @param {HTMLElement} _tgt
         * @param {HTMLElement[]|Node} _el
         * @param {Boolean} [isPrepend]
         */
        appendHTMLElement : function(_tgt, _el, isPrepend = false) {
            if ( $N.isArray(_el) ) {
                _el.forEach(_e => isPrepend ? _tgt.prepend(_e) : _tgt.append(_e))
            }
            else {
                isPrepend ? _tgt.prepend(_el) : _tgt.append(_el)
            }
        },

        isIterable : function(param) {
            if ( this.isEmpty(param) ) return false;

            return typeof param[Symbol.iterator] === 'function'
        },
        /**
         * RETURN VARIABLE'S TYPE
         * @function getType
         * @param {*} param :: 타입을 확인할 변수 명
         * @return {String} type
         */
        getType : function(param) {
            try {
                return param.constructor.name.toLowerCase();
            }
            catch (e) {
                return null;
            }
        },
        /**
         * CHECK PARAM'S TYPE
         * @function getType
         * @param {Object} param 타입을 확인할 변수 명
         * @param {String} type 타입명
         * @return {boolean}
         */
        checkType: function(param, type) {
            let typeNm = this.getType(param);
            try {
                return typeNm.indexOf(type.toLowerCase()) !== -1;
            }
            catch (e) {
                return false;
            }
        },
        /**
         * CHEK PARAMETER IS ARRAY
         * @function isArray
         * @param {*} param :: 확인할 변수 명
         * @return {boolean}
         */
        isArray : function(param) {
            return this.checkType(param, 'array') || this.checkType(param, 'list');
        },
        /**
         * CHEK PARAMETER IS MULTI DIMESIONAL ARRAY
         * @function isArray
         * @param {*} param :: 확인할 변수 명
         * @return {boolean}
         */
        isMultiDimensionArray : function(param) {
            return this.checkType(param[0], 'array');
        },
        /**
         * CHEK PARAMETER IS OBJECT
         * @function isObject
         * @param {*} param :: 확인할 변수 명
         * @return {boolean}
         */
        isObject : function(param) {
            return this.checkType(param, 'object');
        },
        /**
         * CHEK PARAMETER IS HTMLElement
         * @function isHtml
         * @param {*} param :: 확인할 변수 명
         * @return {boolean}
         */
        isHtml : function(param) {
            return this.checkType(param, 'html');
        },
        /**
         * CHEK PARAMETER IS NODE
         * @function isNode
         * @param {*} param :: 확인할 변수 명
         * @return {boolean}
         */
        isNode : function(param) {
            return this.checkType(param, 'node');
        },
        /**
         * CHEK PARAMETER IS String
         * @function isString
         * @param {*} param :: 확인할 변수 명
         * @return {boolean}
         */
        isString : function(param) {
            return this.checkType(param, 'string');
        },
        /**
         * CHEK PARAMETER IS Number
         * @function isNumber
         * @param {*} param :: 확인할 변수 명
         * @return {boolean}
         */
        isNumber : function(param) {
            return this.checkType(param, 'number');
        },
        /**
         * CHEK PARAMETER IS Boolean
         * @function isBoolean
         * @param {*} param :: 확인할 변수 명
         * @return {boolean}
         */
        isBoolean : function(param) {
            return this.checkType(param, 'boolean');
        },
        /**
         * CHEK PARAMETER IS Function
         * @function isFunction
         * @param {*} param :: 확인할 변수 명
         * @return {boolean}
         */
        isFunction : function(param) {
            return this.checkType(param, 'function');
        },
        /**
         * CHEK PARAMETER IS Jquery Object
         * @function isJqueryObj
         * @param {*} param :: 확인할 변수 명
         * @return {boolean}
         */
        isJqueryObj : function(param) {
            return param.constructor.name === 'w' && param.length != 0;
        },

        /**
         * CHEK PARAMETER IS NOT EMPTY
         * @function isNotEmpty
         * @param {any} src :: 비어있는지 확인할 변수
         * @return {boolean}
         */
        isNotEmpty : function(src) {
            try {
                if (typeof src == 'undefined') return false;

                if ( this.checkType(src, 'list') ) {
                    if ( src.length === 0 ) return false;
                    else return true;
                }
                else if ( this.isObject(src) ) {
                    let keys = Object.keys(src);
                    let entries = Object.entries(src);

                    if ( keys.length === 0 ) return false;

                    let filtered = entries.filter(([_k, _v]) => {
                        if ( $N.isFunction(_v) ) return false;
                        return this.isNotEmpty(_v);
                    })
                    if ( filtered.length === 0 ) return false;

                    return true;
                }
                else if ( this.isArray(src) ) {
                    if ( src.length === 0 ) return false;
                    else return true;
                }
                else if ( this.isJqueryObj(src) ) {
                    if ( src.length === 0 ) return false;
                    else return true;
                }
                let obj = String(src);

                if (obj == null || obj == undefined || obj == 'null' || obj == 'undefined' || obj == '') return false;
                return true;
            }
            catch(e) {

            }
            return false;
        },
        /**
         * CHEK PARAMETER IS EMPTY
         * @function isEmpty
         * @param {*} src
         * @return {boolean}
         */
        isEmpty : function(src) {
            return !this.isNotEmpty(src);
        },
        /**
         * CHECK PARAMETER IS UNDEFINED
         * @function isUndefined
         * @param {*} src
         * @returns {boolean}
         */
        isUndefined : (src) => {
            return src === undefined;
        },
        /**
         * CHEK PARAMETER IS NOT EMPTY
         * @param {*} src
         * @returns {boolean}
         */
        isEmptyArray : function(src) {

            if ( $N.isArray(src) )
                return this.isEmpty(src.join(""));
            else
                return false;
        },
        /**
         * CHEK PARAMETER IS EMPTY OBJECT
         * @function isEmptyObject
         * @param {Object} src :: 비어있는지 확인할 변수
         * @return {boolean}
         */
        isEmptyObject : function(src) {

            if ( !$N.isObject(src) ) {
                console.error("ARG IS NOT OBJECT");
                return true;
            }

            let keys = Object.keys(src), builder = "";

            if ( keys.length === 0 ) return true;
            try {
                keys.forEach(function(k) {
                    builder += src[k].trim();
                })
            }
            catch(e) {
            }

            return this.isEmpty(builder);
        },
        /**
         * MAKE DEEP COPY OF OBJECT
         * @function deepcopy
         * @param {*} src :: 복사할 변수
         * @return {object}
         */
        deepcopy : function(src) {

            if ( $N.isEmpty(src) && !$N.isArray(src) ) return null;

            let clone = $N.isObject(src) ? {} : $N.isArray(src) ? [] : '';
            if ( $N.checkType(src, "HTML") ) {
                clone = src.cloneNode();
            }
            else if ( $N.isObject(src) ) {
                for (let key in src) {
                    if (typeof src[key] == "object" && src[key] != null) {
                        clone[key] = $N.deepcopy(src[key]);
                    }
                    else {
                        clone[key] = src[key];
                    }
                }
            }
            else if ( $N.isArray(src) ) {
                src.forEach((itm) => {
                    clone.push($N.deepcopy(itm));
                })
            }
            else {
                clone = src;
            }

            return clone;
        },
        /**
         * POP SPECIFIC ARRAY ELEMENT WITH STRING
         * @function comparePop
         * @param {array} arr :: 대상 배열
         * @param {object} tgt :: 삭제할 대상
         * @return {array}
         */
        comparePop : function(arr, tgt) {
            if ( !this.isArray(arr) ) throw new Error('PARAM1 IS NOT ARRAY');
            if ( this.isEmpty(tgt) ) return arr;

            let tgtIdx = arr.indexOf(tgt);

            if ( tgtIdx === -1 ) return arr;

            arr.splice(tgtIdx, 1);

            return arr;
        },
        formToObj: function (_selector) {
            return this.formToJson(_selector, {})
        },
        /**
         * Convert to json object from given form element
         * @function formToJson, formToObj
         * @param {String|HTMLElement} _selector 대상 element selector
         * @param {{exclude: string[]}} [_options] JSON변환 옵션
         * @param {boolean} _options.stringify JSON stringify 여부
         * @param {String|Array} _options.removeDash 대쉬(-) 제거 대상 key
         * @param {String|Array} _options.exclude 제외 대상 key
         * @param {function} _options.postProcess 후처리 함수
         * @return {Object}
         */
        formToJson: function(_selector, _options) {

            let $form = this.isHtml(_selector) ? _selector : document.querySelector(_selector);

            if ( this.isEmpty($form) ) {
                return {};
            }

            let $elements = $form.querySelectorAll("select, input, textarea"),
                $tgt = [...$elements];

            let jsonz = $tgt.reduce((_result, _el) => {
                if ( _el.disabled )
                    return _result;
                if ( (_el.type === 'checkbox' || _el.type === 'radio') && !_el.checked )
                    return _result;
                if ( $N.isNotEmpty(_el.name) ) {
                    try {
                        let elValue = _el.value || '';

                        if ( _el.type === 'checkbox' ) {
                            let checkedArr = [...$form.querySelectorAll(`input[name=${_el.name}]:checked`)]
                            elValue = checkedArr.map(_item => _item.value)
                            if ( elValue.length === 1 ) elValue = elValue[0];
                        }

                        _result[_el.name] = elValue
                        if ( _el.type.toLowerCase() === 'number' ) _result[_el.name] = Number(elValue)

                        return _result
                    }
                    catch (e) {
                        console.log(e)
                        console.log(_el)
                        console.log(_result)
                    }
                }
                return _result
            }, {})

            if ( _options?.stringify ) {
                return JSON.stringify(jsonz);
            }
            if ( _options?.removeDash ) {

                if ( $N.isString(_options.removeDash) ) _options.removeDash = _options.removeDash.split(",");

                _options.removeDash.forEach(function(target) {
                    jsonz[target] = jsonz[target]?.replaceAll("-", "");
                })
            }
            if ( _options?.exclude ) {

                if ( $N.isString(_options.exclude) ) _options.exclude= _options.exclude.split(",");

                _options.exclude.forEach(function(target) {
                    delete jsonz[target];
                })
            }
            if ( _options?.postProcess ) {
                _options.postProcess(jsonz);
            }

            return jsonz;

        },
        /**
         * DESCRIBE JSON INTO HTML
         * @function describe
         * @param {Object|String} json
         * @param {String|HTMLElement} target
         * @param {Object} [options]
         * @param {boolean} [keepValueWhenDataNull]
         * @eg -> $N.describe({vocSeq : 1234, vocCd : 1}, "dataForm")
         */
        describe : function(json, target, options) {

            if ( $N.isEmpty(json) ) {
                console.error("Insufficient parameter [json]");
                return;
            }
            if ( $N.isEmpty(target) ) {
                console.error("Insufficient parameter [target]");
                return;
            }

            options = options || {};
            options.setRaw = $N.isEmpty(options.setRaw) ? false : options.setRaw;
            options.keepValue = $N.isEmpty(options.keepValue) ? false : options.keepValue;

            let wrap = target;

            if ( $N.isString(target) )
                wrap = document.querySelectorAll("[id='"+ target +"'], [name='"+ target +"']");
            else if ( $N.isJqueryObj(target) )
                wrap = target.toArray();
            else if ( $N.isHtml(target) )
                wrap = target;
            else if ( $N.isNode(target) )
                wrap = target;

            try {
                wrap = [...wrap];
            }
            catch (e) {
                wrap = [wrap];
            }

            if ( $N.isEmpty(wrap) ) {
                console.error('not available target :: ', target);
                return;
            }

            let keys = Object.keys(json);

            keys.forEach(function(k) {
                try {
                    wrap.forEach(function(w) {

                        if ( options.setRaw ) w?.setAttribute("data-raw", JSON.stringify(json));

                        let nodes =
                            [w, ...w.querySelectorAll("[id='"+ k +"'], [name='"+ k +"']")].filter(el => {
                                if ( el?.matches ) {
                                    return el.matches("[id='" + k + "'], [name='" + k + "']")
                                }
                                return false;
                            });

                        nodes.forEach(function(n) {

                            if ( $N.isString(json[k]) || $N.isNumber(json[k]) ) {
                                let nodeName = n.nodeName.toLowerCase();
                                let typeName = n.type?.toLowerCase();

                                if ( nodeName === 'input' || nodeName === 'select' || nodeName === 'textarea' ) {
                                    if ( typeName === 'radio' || typeName === 'checkbox' ) {
                                        if ( n.value === json[k] ) {
                                            n.checked = true
                                        }
                                    }
                                    else {
                                        n.value = json[k];
                                    }
                                }
                                else {

                                    if ( n.classList.contains('smf-date') ) return;

                                    if ( $N.isString(json[k]) )
                                        json[k] = json[k].replaceAll("\n", "<br/>");

                                    n.innerHTML = json[k];
                                    n.title = json[k];
                                }
                            }

                        })
                    })
                }
                catch(e) {
                    console.log(e)
                }
            })

        },
        /**
         * SET PERIOD BETWEEN TWO DATEPCIKERS
         * @function setPeriod
         * @param {String} sd_id :: 검색 시작일 input form id
         * @param {String} ed_id :: 검색 종료일 input form id
         * @param {String} terms :: 기간-일D, 주W, 월M, SOM 해당월의 시작일,SOY 해당 년도의 시작일
         * @param {String, Integer} quantity :: 기간(숫자)
         * @eg -> 최근 3주를 검색기간으로 설정할 경우
         $N.setPeriod("startDt", "endDt", 3, "W")
         */
        setPeriod: function(sd_id, ed_id, terms, quantity){

            quantity = quantity || 1
            let isExt = false;

            if ( $N.isNotEmpty(Ext.getCmp('__'+sd_id)) ) isExt = true;

            let endDd = moment();
            let startDd = moment();

            if ( terms === 'SOW') {
                startDd = startDd.startOf('week');
                endDd = endDd.endOf('week');
            }
            else if ( terms === 'SOM') {
                startDd = startDd.startOf('month');
                endDd = endDd.endOf('month');
            }
            else if ( terms === 'SOY') {
                startDd = startDd.startOf('year');
                endDd = endDd.endOf('year');
            }
            else if (terms != 'D') {
                startDd = moment().subtract(quantity, terms);
            }

            if ( isExt ) {
                Ext.getCmp('__'+sd_id).setValue(startDd.format('YYYY-MM-DD'));
                Ext.getCmp('__'+ed_id).setValue(endDd.format('YYYY-MM-DD'));
            }
            else {
                document.querySelector("#"+sd_id).value = startDd.format('YYYY-MM-DD');
                document.querySelector("#"+ed_id).value = endDd.format('YYYY-MM-DD');
            }
        },
        /**
         * MAKE HTML SELECT TAG WITH AJAX RESULT
         * @function selectWithAjax
         * @param {object} param :: {url : "JR_...", attr: {}, appendTo: "#id" }
         * @return {HTMLElement}
         */
        selectWithAjax: function(param) {

            if ( $N.isEmpty(param) ) throw new Error('PARAMETER IS EMPTY');
            if ( $N.isEmpty(param.url) ) throw new Error('URL IS EMPTY');
            if ( !$N.isObject(param.attr) ) throw new Error('ATTRIBUTE IS NOT OBJECT');

            let attr = param.attr
                , url = param.url
                , appendTo = param.appendTo
                , onchange = param.onchange;

            attr.class = attr.class || 'smf-select';

            let childArr = [{tagName: 'option', value : '', label: '-- 선택하세요 --' }];

            // RESPONSE JSON MUST BE {key: "key", value: "value"} pattern
            $.get(url, function(data) {
                data.forEach(function(optObj) {
                    childArr.push({tagName : 'option', value: optObj.VALUE, label: optObj.KEY});
                })

                $.extend(attr, {tagName : 'select', children: childArr})

                let selectTag = $N.elCreator(attr);

                if ( $N.isNotEmpty(onchange) ) {
                    selectTag.onchange = onchange;
                }

                if ( $N.isNotEmpty(appendTo) ) {
                    document.querySelector(appendTo).appendChild(selectTag);
                }

                return selectTag;
            })

        },

        /**
         * CHECK {src} CONTAINS {val}
         * @function contains
         * @param {object} src source string
         * @param {object} val search value
         * @return {Boolean}
         */
        contains : function(src, val) {

            if ( $N.isString(src) || $N.isArray(src)  ) {
                return src.indexOf(val) !== -1;
            }
            else if ( $N.isNumber(src) ) {
                return [src].indexOf(val) !== -1;
            }
            return false;
        },
        arrayEquals(a, b) {
            return Array.isArray(a) && Array.isArray(b) &&
                a.length === b.length &&
                a.every((val, index) => val === b[index]);
        },

        /**
         * PARSE JSON STRING
         * @function contains
         * @param {object} src
         * @return {Object|Array}
         */
        JsonParser : function(src) {

            if ( $N.isString(src) ) {
                try {
                    src = JSON.parse(src);
                }
                catch(e) { }
            }
            if ( $N.isObject(src) ) {
                Object.keys(src).forEach((k) => {
                    try {
                        src[k] = JSON.parse(src[k]);
                    }
                    catch(e) { }
                });
            }
            if ( $N.isArray(src) ) {
                src.forEach((item) => $N.JsonParser(item))
            }
            return src;

        },
        observeDOM : function( obj, callback ) {
            var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
            if( !obj || obj.nodeType !== 1 ) return;

            if( MutationObserver ){
                // define a new observer
                var mutationObserver = new MutationObserver(callback)

                // have the observer observe foo for changes in children
                mutationObserver.observe( obj, { childList:true, subtree:true })
                return mutationObserver
            }

            // browser support fallback
            else if( window.addEventListener ){
                obj.addEventListener('DOMNodeInserted', callback, false)
                obj.addEventListener('DOMNodeRemoved', callback, false)
            }
        },

        regexOnlyDigits : function(src) {

            try {
                const regex = /[^0-9]/g;
                src = src.replace(regex, "");
            }
            catch (e) {}

            return src;
        },

        regexNumComma : function(number) {

            if ( this.isEmpty(number) ) return;

            // 숫자일 경우, 문자로 바꾸기.
            let string = number + "";

            // ±기호, 소수점, 숫자가 아닌 부분은 지우기.
            string = string.replace( /^\s+|\s+$|,|[^+-\.\d]/g, "" )

            //정규식
            let regExp = /([+-]?\d+)(\d{3})(\.\d+)?/;

            while ( regExp.test( string ) ){
                string = string.replace( regExp, "$1" + "," + "$2" + "$3" );
            }

            return string;
        },
        commonRegexFormatDate : function(_val) {
            if ( _val.length === 8 ) return $N.regexFormatDateYYYYMMDD(_val);
            if ( _val.length === 12 ) return $N.regexFormatDateYYYYMMDDHH24MI(_val);
            if ( _val.length === 14 ) return $N.regexFormatDateYYYYMMDDHH24MISS(_val);

        },
        regexFormatDateYYYYMMDD : function(_val) {
            return _val.replace(/^(\d{4})(\d{2})(\d{2})$/, '$1-$2-$3')
        },
        regexFormatDateYYYYMMDDHH24MISS : function(_val) {
            return _val.replace(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/, '$1-$2-$3 $4:$5:$6')
        },
        regexFormatDateYYYYMMDDHH24MI : function(_val) {
            return _val.replace(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})$/, '$1-$2-$3 $4:$5')
        },

        regexHypenEvery4Digits : function(_val) {
            if ( $N.isEmpty(_val) ) return "";
            return _val.replace(/(\d{4})(?=\d)/g, '$1-');
        },

        regexTestDate : function(_value, _delimeter = '') {

            let expression = `^\\d{4}${_delimeter}(0[1-9]|1[012])${_delimeter}(0[1-9]|[12][0-9]|3[01])$`

            let regex = new RegExp(expression)

            return regex.test(_value)
        },

        regexTestYN : function(_value, _yn) {

            let expression = _yn.toUpperCase() === 'Y' ? 'yes|Yes|Y|예' : '아니오|N|no|No'

            let regex = new RegExp(expression, 'g')

            return regex.test(_value)
        },

        regexTestStr : function(_value, _str) {

            let regex = new RegExp(`([${_str}])`, 'g')

            return regex.test(_value)
        },

        regexFormatDate : function(_value, _format = "$1-$2-$3") {

            let date = $N.regexOnlyDigits(_value+"")

            if ( $N.regexTestDate(date) ) {
                return date.replace(/^(\d{4})(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])$/g, "$1-$2-$3");
            }
            else {
                console.log(_value + 'is INVALID DATE');
                return '';
            }
        },

        parseQueryToObject : function(url) {

            let result = {};
            const params = new URLSearchParams(url.substring(url.indexOf('?')));

            for ( let [k, v] of params.entries() ) {
                result[k] = v;
            }

            return result;
        },

        getParentCompenet : function(cmpId) {

            let cmp = opener?.Ext?.getCmp(cmpId) || parent?.Ext?.getCmp(cmpId);
            let cmpClass = cmp.__proto__.$className;

            if ( $N.contains(cmpClass, 'Ext.window.Window') ) {
                return cmp.items.items[0].el.dom.contentWindow;
            }
            if ( $N.contains(cmpClass, 'Ext.Component') ) {
                return cmp.el.dom.contentWindow;
            }
            return cmp;
        },
        callFunctionByCmpId : function(cmpId, funcName, ...args) {

            let _cmp = $N.getParentCompenet(cmpId);
            let _fn = _cmp?.el.dom.querySelector("iframe").contentWindow[funcName] || _cmp?.el?.dom.contentWindow[funcName];

            if ( $N.isFunction(_fn) ) {
                _fn(...args);
            }
        },

        callParentFunction : function(funcName, ...args) {

            if ( $N.isEmpty(__param?.parentCmpId) ) throw new Error('NO __param FOUND. GLOBAL VARIABLE : __param REQUIRED');

            $N.callFunctionByCmpId(__param.parentCmpId, funcName,...args);
        },

        getVarFromCmp : function(varName, cmpId) {

            let _cmp = $N.getParentCompenet(cmpId);
            let _let = _cmp?.el.dom?.contentWindow[varName];

            return _var;
        },

        getParentVar : function(varName) {

            if ( $N.isEmpty(__param?.parentCmpId) ) throw new Error('NO __param FOUND. GLOBAL VARIABLE : __param REQUIRED');

            return $N.getVarFromCmp(varName, __param?.parentCmpId)
        },

        getValueFromCmp : function(selector, cmpId) {

            let _cmp = $N.getParentCompenet(cmpId);
            let _document = _cmp?.el.dom?.contentDocument;

            return _document.querySelector(selector).value;
        },
        getParentValue : function(selector) {

            if ( $N.isEmpty(__param?.parentCmpId) ) throw new Error('NO __param FOUND. GLOBAL VARIABLE : __param REQUIRED');

            return $N.getValueFromCmp(selector, __param?.parentCmpId)
        },
        /**
         * @function hasDecimal
         * @description {num} 인자가 소수점을 포함하는지 확인합니다
         * @param {Integer} num
         * @returns {boolean}
         */
        hasDecimal : function(num) {
            return num % 1 !== 0;
        },
        /**
         * @function minifyFloatingPoint
         * @description javascript 부동소수점 처리 방식을 보완합니다
         * @example
         * console.log(0.3 === 0.1 + 0.2) // false
         * console.log(0.3 ===Math.round((0.1 + 0.2 + Number.EPSILON) * 100) / 100) // true
         * @param {Integer} num
         * @returns {Integer}
         */
        minifyFloatingPoint : function(num) {
            return Math.round((num + Number.EPSILON) * 100) / 100
        },

        /**
         * @function decodeHTMLEntity
         * @description HTML 엔티티 문자를 일반 분자열로 치환합니다.
         * @param {String} entityText
         * @param {boolean} isBR
         * @returns {string}
         */
        decodeHTMLEntity : function(entityText, isBR = true) {
            let replaced;
            try {
                replaced = $N.elCreator({tagName : "textarea",html : entityText}).textContent;
                replaced = isBR ? replaced.replace(/\n/g, '<br/>') : replaced;
            }
            catch (e) {}

            return replaced
        },

        /**
         * @function mergeDeep
         * @description Object.assign()이 Object전체를 덮어씌우는 문제점 보완
         * @param {Object} target
         * @param {...Object} sources
         * @returns {*}
         */
        mergeDeep(target, ...sources) {
            if (!sources.length) return target;
            const source = sources.shift();

            for (const key in source) {
                if ($N.isObject(source[key])) {
                    if (!target[key]) Object.assign(target, { [key]: {} });
                    $N.mergeDeep(target[key], source[key]);
                } else {
                    Object.assign(target, { [`${key}`]: source[key] });
                }
            }

            return $N.mergeDeep(target, ...sources);
        },

        /**
         * @function objectToPathByBool
         * @description Object를 path로 변환합니다
         * @example
         * let data = { key1 : { key2 : true, key3: false } }
         * $N.objectToPath(data)
         * => result :: ['key1.key2']
         * @param obj
         * @param parentKey
         * @returns {any[]}
         */
        objectToPathByBool(obj, parentKey) {
            return [...Object.entries(obj).reduce((_result, [k, v]) => {
                if ( $N.isNotEmpty(v) && typeof v === 'object' )
                    _result = [..._result, ...$N.objectToPath(v, (parentKey ? parentKey+"." : "") + k)]
                if (v === true)
                    _result.push(parentKey + "." + k)
                return _result
            }, [])]
        },

        /**
         * @function objectToPath
         * @description Object를 path로 변환합니다 (값이 존재할 경우)
         * @example
         * let data = { key1 : { key2 : 1, key3: 2 } }
         * $N.objectToPath(data)
         * // ['key1.key2', 'key1.key2']
         * @param _obj
         * @param [_parentKey]
         * @returns {any[]}
         */
        objectToPath(_obj, _parentKey) {

            return [...Object.entries(_obj).reduce((_result, [k, v]) => {
                if ( $N.isNotEmpty(v) && typeof v === 'object' )
                    _result = [..._result, ...$N.objectToPath(v, (_parentKey ? _parentKey+"." : "") + k)]
                else if ( !_parentKey )
                    _result.push(k);
                else
                    _result.push(_parentKey + "." + k)

                return _result
            }, [])]
        },

        objectToPathWithValue(_obj, _prefix, _exclude = []) {

            let paths = {};

            for (const key in _obj) {
                const fullPath = _prefix ? `${_prefix}.${key}` : key;

                if ( $N.contains(_exclude, fullPath) ) {
                    $N.mergeDeep(paths, { [`${fullPath}`] : _obj[key] });
                }
                else if ( $N.getType(_obj[key]) === 'object' && _obj[key] !== null ) {
                    paths = $N.mergeDeep(paths, $N.objectToPathWithValue(_obj[key], fullPath, _exclude));
                }
                else {
                    $N.mergeDeep(paths, { [`${fullPath}`] : _obj[key] });
                }
            }
            return paths;
        },

        getValueByPath(_obj, _path) {
            if ( $N.isEmpty(_obj) || $N.isEmpty(_path) ) return;
            // console.log(_obj, _path)
            let ognl = $N.deepcopy(_obj);
            for (var _i = 0, _path = _path.split('.'), len = _path.length; _i < len; _i++){
                // console.log(ognl, _path, _i, _path[_i])
                ognl = !!ognl?._path[_i] || '';
            };
            return ognl;
        },

        /**
         * @function objectToURLQueryString
         * @description Convert Javascript Object to URL Query String
         * @param _obj
         * @returns {string}
         */
        objectToURLQueryString(_obj) {
            return new URLSearchParams(_obj).toString();
        },

        /**
         *
         * @param pts
         * @returns {{x: number, y: number}}
         */
        getPolygonCentroid(pts) {
            var first = pts[0], last = pts[pts.length-1];
            if (first.x != last.x || first.y != last.y) pts.push(first);
            var twicearea=0,
                x=0, y=0,
                nPts = pts.length,
                p1, p2, f;
            for ( var i=0, j=nPts-1 ; i<nPts ; j=i++ ) {
                p1 = pts[i]; p2 = pts[j];
                f = p1.x*p2.y - p2.x*p1.y;
                twicearea += f;
                x += ( p1.x + p2.x ) * f;
                y += ( p1.y + p2.y ) * f;
            }
            f = twicearea * 3;
            return { x:x/f, y:y/f };
        },

        toggleClass(_selector, _className) {

            let tgtEls = document.querySelectorAll(_selector) || document.querySelectorAll("#"+_selector) || document.querySelectorAll("[name="+ _selector +"]");

            if ( $N.isEmpty(tgtEls) ) return;

            [...tgtEls].forEach(_tgtEl => {
                if ( _tgtEl.classList.contains(_className) )
                    _tgtEl.classList.remove(_className)
                else
                    _tgtEl.classList.add(_className)
            })
        },

        arrayRange(_s, _e) {
            return Array(_e - _s + 1).fill().map((_, idx) => _s + idx)
        },

        /**
         * @function getMaxNumberOfTableCell
         * Get max number of cells from every row
         * @param {HTMLTableElement} _table
         * @returns {number}
         */
        getMaxNumberOfTableCell(_table) {
            let cellCnts = Array.from(_table.rows, _tr => _tr.children.length);
            return $N.isNotEmpty(cellCnts) ? Math.max(...cellCnts) : 0;
        },

        async fetch(_url, _param, _method = "GET", _isStringify) {

            let isPOST = _method === "POST";
            let fetchURL = `${_url + (isPOST ? "" : "?" + $N.objectToURLQueryString(_param))}`;

            let fetchParam = {
                method: _method,
                headers: {}
            };

            // Handle POST request
            if (isPOST) {
                let hasFile = false;
                const formData = new FormData();

                // Check if _param contains files and build FormData
                for (const [key, value] of Object.entries(_param)) {
                    if (value instanceof File || value instanceof Blob) {
                        hasFile = true;
                        formData.append(key, value);
                    } else {
                        formData.append(key, value);
                    }
                }

                if (hasFile) {
                    fetchParam.body = formData;
                } else {
                    fetchParam.headers["Content-Type"] = _isStringify ? "application/json; charset=UTF-8" : "application/x-www-form-urlencoded; charset=UTF-8";
                    fetchParam.body = _isStringify ? JSON.stringify(_param) : $N.objectToURLQueryString(_param);
                }
            }

            let data;
            try {
                data = await fetch(fetchURL, fetchParam)
                        ?.then((response) => response?.json())
                        ?.then((json) => json);
            } catch (e) {
                console.error("Fetch error:", e);
            }

            return data || {};
        },

        /**
         * @function fetchSimple
         * @param {String} _url request URL
         * @param {Object} [_param] request Params
         * @param {String} [_method] Http request method
         * @param {boolean} [_isStringify] stringify body
         * @returns {any}
         */
        async fetchSimple(_url, _param, _method = "GET", _isStringify) {

            let isPOST = _method === "POST";
            let fetchURL = `${_url + (isPOST? "" : "?" + $N.objectToURLQueryString(_param))}`

            let fetchParam = {
                method: _method,
                headers: {
                    "Content-Type": _isStringify ? "application/json; charset=UTF-8" : "application/x-www-form-urlencoded; charset=UTF-8",
                }
            }

            if ( _method === "POST" )
                fetchParam.body = _isStringify ? JSON.stringify(_param) : $N.objectToURLQueryString(_param);

            let data;
            try {
                data = await fetch(fetchURL, fetchParam)
                        ?.then((response) => response?.json())
                        ?.then((json) => json);
            }
            catch(e) {}

            return data || {};
        },
        /**
         * @function fetchSimple
         * @param {String} _url request URL
         * @param {Object} [_param] request Params
         * @param {String} [_method] Http request method
         * @param {boolean} [_isStringify] stringify body
         * @returns {any}
         */
        async fetchSimpleText(_url, _param, _method = "GET", _isStringify) {

            let isPOST = _method === "POST";
            let fetchURL = `${_url + (isPOST? "" : "?" + $N.objectToURLQueryString(_param))}`

            let fetchParam = {
                method: _method,
                headers: {
                    "Content-Type": _isStringify ? "application/json; charset=UTF-8" : "application/x-www-form-urlencoded; charset=UTF-8",
                }
            }

            if ( _method === "POST" )
                fetchParam.body = _isStringify ? JSON.stringify(_param) : $N.objectToURLQueryString(_param);

            let data;

            try {
                data = await fetch(fetchURL, fetchParam)
                                .then((response) => response.text())
                                .then((_result) => _result);
            }
            catch(e) {}

            return data;
        },

        /**
         * Get data from src if value present
         * @param Any _src
         * @param [String|Integer] _key or index
         * @returns {*|string}
         */
        getIfPresent(_src, _key) {

            if ( $N.isEmpty(_src) ) return "";

            let isKeyExists = $N.isNotEmpty(_key);

            if ( $N.isString(_src) || $N.isNumber(_src) )
                return $N.isNotEmpty(_src) ? _src : "";
            else if ( $N.isObject(_src) && isKeyExists )
                return $N.isNotEmpty(_src[_key]) ? _src[_key] : "";
            else if ( $N.isObject(_src) && !isKeyExists )
                return $N.isNotEmpty(_src) ? _src : "";
            else if ( $N.isArray(_src) && isKeyExists )
                return $N.isNotEmpty(_src[_key]) ? _src[_key] : "";
            else if ( $N.isArray(_src) && !isKeyExists )
                return $N.isNotEmpty(_src) ? _src : "";
            else
                return ""
        },

        encoding : {
            /*
            wordArray: { words: [..], sigBytes: words.length * 4 }
            */

            // assumes wordArray is Big-Endian (because it comes from CryptoJS which is all BE)
            // From: https://gist.github.com/creationix/07856504cf4d5cede5f9#file-encode-js
            convertWordArrayToUint8Array(wordArray) {
                var len = wordArray.words.length,
                    u8_array = new Uint8Array(len << 2),
                    offset = 0, word, i
                ;
                for (i=0; i<len; i++) {
                    word = wordArray.words[i];
                    u8_array[offset++] = word >> 24;
                    u8_array[offset++] = (word >> 16) & 0xff;
                    u8_array[offset++] = (word >> 8) & 0xff;
                    u8_array[offset++] = word & 0xff;
                }
                return u8_array;
            },

            // create a wordArray that is Big-Endian (because it's used with CryptoJS which is all BE)
            // From: https://gist.github.com/creationix/07856504cf4d5cede5f9#file-encode-js
            convertUint8ArrayToWordArray(u8Array) {
                var words = [], i = 0, len = u8Array.length;

                while (i < len) {
                    words.push(
                        (u8Array[i++] << 24) |
                        (u8Array[i++] << 16) |
                        (u8Array[i++] << 8)  |
                        (u8Array[i++])
                    );
                }

                return {
                    sigBytes: words.length * 4,
                    words: words
                };
            },

            convertUint8ArrayToBinaryString(u8Array) {
                var i, len = u8Array.length, b_str = "";
                for (i=0; i<len; i++) {
                    b_str += String.fromCharCode(u8Array[i]);
                }
                return b_str;
            },

            convertBinaryStringToUint8Array(bStr) {
                var i, len = bStr.length, u8_array = new Uint8Array(len);
                for (var i = 0; i < len; i++) {
                    u8_array[i] = bStr.charCodeAt(i);
                }
                return u8_array;
            }

        },

        copyText(selector) {

            var range = document.createRange();
            range.selectNode(document.querySelector(selector));
            window.getSelection().removeAllRanges(); // clear current selection
            window.getSelection().addRange(range); // to select text
            document.execCommand("copy");
            window.getSelection().removeAllRanges();// to deselect

            if ( $N.isNotEmpty(Notify) ) {
                new Notify ({
                    title: '복사되었습니다.',
                })
            }
        },

        getDuplicatedFields : (jsonData) => {

            return Object.keys(jsonData).map(_k => {
                let $el = document.querySelector("#"+ _k);
                if ( $N.isNotEmpty($el) && $N.isNotEmpty($el.value) ) {
                    return _k
                }
            }).filter(_f => $N.isNotEmpty(_f));
        },

        /**
         * @function indicatorEl
         * @description indicator html element를 저장합니다
         * @return {HTMLElement}
         */
        indicatorEl : null,
        /**
         * @function showLoadingIndicator
         * @description 현재 표시중인 document body에 indicator를 표시합니다.
         */
        showLoadingIndicator : () => {
            let indicatorEl = `
                <div id="indicatorEl" style="background: #a7a4a438; z-index: 99999; width: 100%; height: 100%; display: block; position: fixed; top: 0;">
                    <div id="loading" style="position: absolute; left: 46%; top: 50%; padding: 2px; height: auto; margin: -35px 0 0 -30px; z-index: 21001;">
                        <div class="loading-indicator" style="background: url(/resources/common/images/shared/gray-loading.gif) no-repeat; color: #555; padding: 0px 46px; margin: 0; text-align: left; height: auto;">
                            <div>로딩중 ...</div>
                            <div class="loading-sysinfo" style="margin-top: 4px; color: rgb(182, 183, 194);">금융소비자보호 내부통제시스템</div>
                        </div>
                    </div>
                </div>`

            $N.indicatorEl = $N.createHTMLElement(indicatorEl)
            document.body.append($N.indicatorEl);
        },
        /**
         * @function hideLoadingIndicator
         * @description 현재 표시중인 loading indicator를 삭제합니다.
         */
        hideLoadingIndicator : () => {
            if ( $N.isNotEmpty($N.indicatorEl) )
                $N.indicatorEl.remove();
        },

        /**
         * @function getSelectedOptNames
         * @description select option의 text를 가져옵니다
         * @param $el
         * @returns {*}
         */
        getSelectedOptNames : ( $el ) => {
            return [...$el].reduce((_result, _current) => {
                return $N.mergeDeep(_result, { [`${_current.id.replace("Cd", "Nm").replace("Yn", "Nm")}`] : $("option:selected", _current).text() });
            }, {})
        },
        /**
         * @function checkByte
         * @description 문자열의 byte를 계산하여 return합니다
         * @param _string
         * @returns {number}
         */
        checkByte : function(_string) {
            _string = _string + "";
            return _string.replace(/[\0-\x7f]|([0-\u07ff]|(.))/g,"$&$1$2").length
        },

        setValueIfExists : (_selector, _value) => {
            let el = document.qs(_selector);
            if ( $N.isNotEmpty(el) ) el.value = _value;
        },

        snakeToCamel : (_str) => {
            if ( $N.isString(_str) ) {
                return _str.toLowerCase().replace(/([-_]\w)/g, (g) => g[1].toUpperCase());
            }
            return _str;
        },

        camelToSnake : (_str, _isLower = false) => {
            if ( $N.isString(_str) ) {
                let result = _str.replace(/([A-Z])/g, "_$1");
                return _isLower ? result.toLowerCase() : result.toUpperCase();
            }
            return _str;
        },

        resetForm : (_selector) => {

            let tgt = document.querySelector(_selector) || document.getElementById(_selector);

            tgt.querySelectorAll("input, select").forEach(_el => {
                _el.value = ''
                _el.checked = false;
            });
        }
    }
})();

window["$N"] = $N;