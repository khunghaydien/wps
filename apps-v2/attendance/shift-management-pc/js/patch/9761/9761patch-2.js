teasp.data.EmpDay.prototype.getDayNote=function(a){var b=this.day.note||"";if(a)return b;if(a=this.day.rack.applyNotes||null){var c=b.indexOf(a);0<c&&(b=b.substring(0,c)+b.substring(c+a.length))}(c=/^(?:\r?\n)(.+)$/.exec(b))&&(b=c[1]);return(a?a+"\r\n":"")+(b||"")};