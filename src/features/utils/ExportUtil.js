import React from 'react';


export async function exportToXlsx( gridElement , fileName ) {
  const [{ utils, writeFile }, { head, body, foot }] = await Promise.all([
    import('xlsx'),
    getGridContent(gridElement)
  ]);
  const emp=new Set()
  body.map(i=>{
    emp.add(i[2])
  })
  head.map(i=>i.splice(0,1))
  const wb = utils.book_new();
  emp.forEach(sheet=>{
    const b=[]
    body.map(i=>{ if(i[2]===sheet){b.push(i);}})
    b.map(i=>i.splice(0,1))
    const ws = utils.aoa_to_sheet([...head, ...b, ...foot]);
    utils.book_append_sheet(wb, ws, sheet);
  })
  writeFile(wb, fileName);
}