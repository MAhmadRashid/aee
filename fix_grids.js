const fs = require('fs');
let c = fs.readFileSync('src/app/page.tsx', 'utf8');

c = c.replace(/className="flex overflow-x-auto snap-x snap-mandatory md:grid md:grid-cols-3 lg:grid-cols-5 gap-4 pb-4 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide"/g, 'className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6"');
c = c.replace(/className="min-w-\[75vw\] sm:min-w-\[45vw\] md:min-w-0 snap-start"/g, 'className="w-full"');

fs.writeFileSync('src/app/page.tsx', c);
console.log("Done");
