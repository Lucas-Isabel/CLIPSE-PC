@echo off
go install github.com/tc-hib/go-winres@latest
go-winres simply --icon youricon.png
go build -ldflags="-H=windowsgui" -o IMPORTADOR_CLIPSE.exe
echo Compilation finished!
pause
