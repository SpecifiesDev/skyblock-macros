Esc::ExitApp

$a Up::
if(toggle:=!toggle) {
    Send, {a Down}
} else {
    Send, {a Up}
}
Return

$s Up::
if(toggle:=!toggle) {
    Send, {s Down}
} else {
    Send, {s Up}
}

Return

$d Up::
if(toggle:=!toggle) {
    Send, {d Down}
} else {
    Send, {d Up}
}
Return
