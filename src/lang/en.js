const _def = $.fn.MultiFile.options;

_def.STRING = {
    remove: '<span class="fa fa-minus-circle" title="Cancel attach">Cancel attach</span>',
    denied: 'You cannot select a $ext file.\nTry again...',
    file: '$file',
    selected: 'File selected: $file',
    duplicate: 'This file has already been selected:\n$file',
    toomuch: 'The files selected exceed the maximum size permited ($size)',
    toomany: 'Too many files selected (max: $max)',
    toobig: '$file is too big (max $size)'
};

_def.list = '.selected-file';
_def.accept = ''; // accepted file extensions
_def.max = -1; // maximum number of selectable files
_def.maxfile = -1; // maximum size of a single file (KB)
_def.maxsize = -1; // maximum size of total payload (KB)

_def.error = function(str) {
    if (typeof console != 'undefined') console.log(str);
    $.salmon.alert(str);
}