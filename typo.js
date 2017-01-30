function TypoMaker(errors, locale) {

    var s;

    String.prototype.splice = function(index, count, add) {
        if (index < 0) {
            index = this.length + index;
            if (index < 0) {
                index = 0;
            }
        }
        return this.slice(0, index) + (add || "") + this.slice(index + count);
    }
    errors = Math.abs(parseInt(errors, 10));
    this.alpha = {
        numbers:"0123456789",

        RU: {
            letters: "абвгдежхийклмнопрстуфхцчшщъыьэюя"
        },

        US: {
            letters: "abcdefghijklmnopqrstuvwxyz"
        },

        BY: {
            letters: "абвгдежхiйклмнопрстуфхцчшъыьэюя"
        }
    }
    //this.deprecated = [" ", "(", ")"];
    this.setInUse = this.alpha[locale].letters;
    //this.data = data;
    this.errorsLeft = errors;
    this.errorsPerData = [];
    if(isFloat(errors)) {
        s = Math.random();
        if(s >= 0 && s <= .5)
            this.errorsLeft = Math.floor(errors);
        else
            this.errorsLeft = Math.ceil(errors);
    }

    if(errors === 1 || errors === 2) {
        s = Math.random();
        if(s >= 0 && s <= 0.333) {
            this.errorsPerData[0] = 1; this.errorsPerData[1] = errors-1; this.errorsPerData[2] = 0;
        }
        else if(s > 0.333 && s <= 0.666) {
            this.errorsPerData[0] = 0; this.errorsPerData[1] = 1; this.errorsPerData[2] = errors-1;
        }
        else if(s > 0.666 && s <= 1) {
            this.errorsPerData[0] = 0; this.errorsPerData[1] = errors; this.errorsPerData[2] = 0;
        }
    }
    else {
        this.errorsPerData[0] = this.errorsPerData[1] = Math.round(this.errorsLeft/3);
        this.errorsPerData[2] = this.errorsLeft - 2*this.errorsPerData[0];
    }

    this.make = function(pieceOfData, errNum) {
        var result = pieceOfData,
            tmp = {iterator:0},
            iterator = 0,
            prob = null;
        return this.loop(result, errNum);
    };

    this.loop = function(data, errNum) {
        for(var errorsMade = 1; errorsMade <= this.errorsPerData[errNum]; errorsMade++) {
            prob = Math.random();
            data = this.transformData(data, errNum);
            errorsMade++;
        }
        return data;
    };

    this.makeInName = function(data) {
        return this.make(data, 0);
    }

    this.makeInAddress = function(data) {
        return this.make(data, 1);
    }

    this.makeInPhone = function(data) {
        return this.make(data, 2);
    }

    this.transformData = function(data, errNum) {
        var prob = Math.random();
        if(this.eq.first(prob)) data = this.change(data);
        if(this.eq.second(prob)) data = this.remove(data);
        if(this.eq.third(prob)) data = this.add(data, errNum);
        return data;
    };

    this.eq = {
        first: function(d) {
            return (d >= 0 && d <= 0.333);
        },
        second: function(d) {
            return d > 0.333 && d <= 0.666;
        },
        third: function(d) {
            return d > 0.666 && d <= 1;
        }
    }

    this.change = function(data) {
        var place = this.getRandomPlace(data)-1;
        return data.splice(place, 2, data.charAt(place+1)+data.charAt(place));
    };

    this.remove = function(data) {
        var place = this.getRandomPlace(data);
        return data.splice(place, 1);
    };

    this.add = function(data, errNum) {
        this.setAlpha(errNum);
        var place = this.getRandomPlace(data),
            s = this.getSymbol();
        if(Math.random()>.5) s = s.toUpperCase();
        return data.splice(place, 0, s);
    };

    this.getRandomPlace = function(data) {
        var place = this.getRandom(data.length-1);
        /*while(this.deprecated.indexOf(data.charAt(place))>=0)
            place = this.getRandom(data.length-1);*/
        return place;
    }

    this.getRandom = function(max) {
        return Math.round(-0.5 + Math.random() * (max + 1));
    }

    this.setAlpha = function(index) {
        if(index === 0 || index === 1)
            this.setInUse = this.alpha[locale].letters;
        else if(index === 2)
            this.setInUse = this.alpha.numbers;
    }

    this.getSymbol = function() {
        return this.setInUse.charAt(this.getRandomPlace(this.setInUse));
    }

    function isFloat(num) {
        return (num - Math.floor(num) === 0) ? false : true;
    }
}

module.exports = TypoMaker;
