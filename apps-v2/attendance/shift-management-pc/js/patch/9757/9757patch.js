if(typeof(teasp)=='object' && !teasp.resolved['MBJS4'] && teasp.view && teasp.view.Monthly){
  teasp.view.Monthly.prototype.viewPostProcess = function(){
    dojo.style('empListButton', 'display', 'none');   //<-▼ボタンを消す
    dojo.style('empListButton2', 'display', 'none');  //<-▼ボタンを消す(mobile)
    dojo.query('td.vnote', dojo.byId('mainTableBody')).forEach(function(td){
      dojo.query('div.note-area', td).forEach(function(el){
        if(el.nextSibling && el.firstChild && el.firstChild.offsetWidth > el.offsetWidth){
          dojo.style(el.nextSibling, 'display', '');
        }
      });
    });
  };
}
