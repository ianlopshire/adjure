Handlebars.registerHelper('methodSelect', function(inMethod, index){
    var methods=["GET", "POST", "PUT", "DELETE", "UPDATE"];

    var html = "<select class='classField' id='method"+index+"'>"

    methods.forEach(function(element){
        html += "<option vale='"+element+"' ";
        if(element == inMethod){
            html += "selected";
        }
        html += ">"+element+"</option>";
    });

    html += "</select>";

    return new Handlebars.SafeString(html);
});

Handlebars.registerHelper('input', function(index, id, value, inPlaceholder, inType){
    var placeholder = typeof inPlaceholder == "string" ? inPlaceholder : " ",
        type = typeof inType == "string" ? inType : "text";

    var html = "<input class='classField' type='"+type+"' value='"+value+"' id='"+id+index+"' placeholder='"+placeholder+"'>";

    return new Handlebars.SafeString(html);
});

Handlebars.registerHelper('textarea', function(index, id, value, inPlaceholder){
    var placeholder = typeof inPlaceholder == "string" ? inPlaceholder : " ";

    var html = "<textarea class='classField' id='"+id+index+"' placeholder='"+placeholder+"'>"+JSON.stringify(value)+"</textarea>";

    return new Handlebars.SafeString(html);
});

window.Adjure = {};

Adjure.defaultCall = {
    title: "New call",
    method: "GET",
    url: "/api/test",
    data: {
        key: "value"
    },
    isDirty: true
};

Adjure.currentData = {
    calls: []
};

Adjure.storedData = {
    calls: []
};

Adjure.init = function(){
    var source = $("#calls-template").html();
    Adjure.callsTemplate = Handlebars.compile(source);
    Adjure.load();
    Adjure.renderLoop();
};

Adjure.renderLoop = function(){
    var html = Adjure.callsTemplate(Adjure.currentData);
    $('#body-js').html(html);
};

Adjure.new = function(){
    Adjure.currentData.calls.push(Adjure.defaultCall);
    //Adjure.storedData.calls.push(Adjure.defaultCall);
    Adjure.renderLoop();
}

Adjure.runCall = function(index){
    var url = Adjure.currentData.calls[index].url,
        method = Adjure.currentData.calls[index].method,
        data = Adjure.currentData.calls[index].data;
        
        if(method === 'GET') {
            url += '?';
            $.each(data, function(key,value) {
                url += key + '=' + value + '&';
            });
            url = url.substring(0,url.length-1);
        }

    $.ajax({
        url: url,
        content: data,
        type: method
    })
}

Adjure.syncCall = function(index){

    var callObject = {
        title: $("#title"+index).html().toString(),
        method: $("#method"+index).val(),
        url: $("#url"+index).val(),
        data: JSON.parse($("#data"+index).val()),
        isDirty: true
    };

    if(Adjure.currentData.calls[index].isDirty){
        Adjure.currentData.calls[index] = callObject;
    } else {
        Adjure.currentData.calls[index] = callObject;
        Adjure.setIsDirtyMarker(index, true);
    }
}

Adjure.load = function(){
    var loaded = JSON.parse(localStorage.getItem("adjure-data-store"));

    if(loaded != null && Array.isArray(loaded)){
        loaded.forEach(function(element){
            Adjure.currentData.calls.push(element);
            Adjure.storedData.calls.push(element);
        });
    }


    if(Adjure.currentData.calls.length == 0){
        Adjure.currentData.calls[0] = Adjure.defaultCall;
        Adjure.storedData.calls[0] = Adjure.defaultCall;
    }
};

Adjure._save = function(){
    localStorage.setItem("adjure-data-store", JSON.stringify(Adjure.storedData.calls));
}

Adjure.delete = function(index){
    Adjure.currentData.calls.splice(index, 1);
    Adjure.storedData.calls.splice(index, 1);
    Adjure._save();
    Adjure.renderLoop();
}

Adjure.saveAll = function(){
    var needUpdate = false;
    Adjure.currentData.calls.forEach(function(item){
        if(!needUpdate && item.isDirty){
            needUpdate = true;
        }
        item.isDirty = false;
    });
    if (needUpdate) {
        Adjure.storedData.calls = Adjure.currentData.calls;
        Adjure._save();
        Adjure.renderLoop();
    }
};

Adjure.saveOne = function(index){
    if(Adjure.currentData.calls[index].isDirty) {
        Adjure.currentData.calls[index].isDirty = false;
        Adjure.storedData.calls[index] = Adjure.currentData.calls[index];
        Adjure._save
        Adjure.setIsDirtyMarker(index, false)
    }
};

Adjure.setIsDirtyMarker = function(index, isDirty) {
    isDirtyMarker = $("#is-dirty"+index);

    if(isDirty) {
        isDirtyMarker.removeClass("hide");
    } else {
        isDirtyMarker.addClass("hide");
    }
};

Adjure._getIndex = function(target){
    return $(target).parents(".call").attr("data-index");
}

// Event Listeners

$("#new-call-js").on('click', function(){
    Adjure.new();
});

$("#save-all-js").on('click', function(){
    Adjure.saveAll();
});

$("#body-js").on('change input', '.classField', function(e){
    var index = Adjure._getIndex(e.target);
    Adjure.syncCall(index);
});

$("#body-js").on('click', '.call-run-js', function(e){
    var index = Adjure._getIndex(e.target);
    Adjure.runCall(index);
});

$("#body-js").on('click', '.call-save-js', function(e){
    var index = Adjure._getIndex(e.target);
    Adjure.saveOne(index);
});

$("#body-js").on('click', '.call-delete-js', function(e){
    var index = Adjure._getIndex(e.target);
    Adjure.delete(index);
});

$("#body-js").on('blur paste input', '.content-editable-js', function(e){
    var index = Adjure._getIndex(e.target);
    Adjure.syncCall(index);
    console.log("title changed");
})
