package controllers

import "html/template"

var temp *template.Template

// SetTemplates configura o template compilado a partir do embed.FS
func SetTemplates(t *template.Template) {
	temp = t
}
