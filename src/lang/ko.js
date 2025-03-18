const _def = $.fn.MultiFile.options;

_def.STRING = {
    remove: '<span class="fa fa-minus-circle" title="첨부 취소">첨부 취소</span>',
    denied: '이 확장자 [$ext]는 첨부가 제한 되었습니다.\n다시선택해주세요',
    file: '$file',
    selected: '선택한 파일: $file',
    duplicate: '이미 선택한 파일입니다.\n[ $file ]',
    toomuch: '업로드 가능한 최대크기를 초과했습니다.\n($size)',
    toomany: '최대 $max 개의 파일만 첨부할 수 있습니다',
    toobig: '$file : 업로드 최대크기 초과 (max $size)'
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