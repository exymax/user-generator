var Typo = require("./typo"),
    fs = require('fs'),
    supportedLocales = ['RU', 'US', 'BY'],
    locale = process.argv[2].toUpperCase(),
    userAmount = process.argv[3],
    mistakeAmount = process.argv[4],
    outputFile = process.argv[5],
    fstream = false,
    writer = null,
    name = phone = address = null;

function out(data) {
    fstream ? writer.write(data) : console.log(data);
}

if(locale && userAmount && mistakeAmount && supportedLocales.indexOf(locale)!=-1) {
    var casual, typo = null;
    casual = require('casual')[locale];
    typo = new Typo(mistakeAmount, locale);
    if(outputFile) {
        writer = fs.createWriteStream(outputFile, {flags: "w"});
        fstream = true;
    }
    for(var i=0;i<userAmount;i++) {
        name = typo.make(casual.full_name);
        phone = typo.make(casual.phone);
        address = typo.make(casual.address);
        out([typo.makeInName(name), typo.makeInAddress(address), typo.makeInPhone(phone)].join("; "));
    }
}
else
    console.log("Some of parameters are invalid");
