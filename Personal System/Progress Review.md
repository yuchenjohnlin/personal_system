```dataviewjs
const pages = dv.pages('"daily"')
    .sort(p => p.file.name, 'desc')
    .limit(10);

for (let page of pages) {
    dv.header(2, `[${page.file.name}](${page.file.path})`);
    dv.paragraph(await dv.io.load(page.file.path));
    dv.el("hr");
}
```

