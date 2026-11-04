/* Silver balances settle in quarters; accrued interest can retain a fractional remainder. */
(function(root){
  'use strict';
  const finite=n=>typeof n==='number'&&Number.isFinite(n);
  const round=n=>Math.round((n+Number.EPSILON)*4)/4;
  const floor=n=>Math.floor(n*4+1e-9)/4;
  const isQuarter=n=>finite(n)&&Math.abs(n*4-Math.round(n*4))<1e-7;
  function format(value){
    if(!finite(value))return '—';
    const units=Math.round(Math.abs(round(value))*4),whole=Math.floor(units/4),part=units%4;
    return (value<0&&units?'−':'')+(whole?whole.toLocaleString('en-US'):part?'':'0')+(['','¼','½','¾'][part]);
  }
  root.SWMoney={round,floor,isQuarter,format};
  if(typeof module!=='undefined'&&module.exports)module.exports=root.SWMoney;
})(typeof globalThis==='undefined'?window:globalThis);
