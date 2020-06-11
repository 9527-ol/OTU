function buildPlot(id){
    d3.json("samples.json").then(function(data){
        //console.log(data)

        var use = data.samples;
        //console.log(use);

        // element in samples
        var samples = use.filter(sampleid => sampleid.id.toString() === id)[0];
        console.log(samples);

        //top 10 sample_values
        var samplevalues = samples.sample_values.slice(0, 10).reverse();
        console.log(samplevalues);
        // get id
        var OTU_num = (samples.otu_ids.slice(0, 10)).reverse();
        console.log(OTU_num);
        // show proper name in bar chart
        var OTU_name = OTU_num.map(n => "OTU" + n)
        // get labels
        var labels = samples.otu_labels.slice(0, 10).reverse();

        //Bar chart trace
        var trace = {
            x: samplevalues,
            y: OTU_name,
            text:labels,
            marker: {
                color : 'lightblue'
            },
            type:"bar",
            orientation: "h",
        };

        var data = [trace];

        var layout = {
            title: "Top 10 OTUs",
            yaxis:{
                type:"Linear",
            },
            margin:{
                l: 100,
                r: 100,
                t: 100,
                b: 50
            },
            height: 500,
            width: 1000
        };

        Plotly.newPlot("bar", data, layout);

        // bubble trace 
        var trace1 = {
            x:samples.otu_ids,
            y:samples.sample_values,
            mode: "markers",
            marker:{
                size: samples.sample_values,
                color: samples.otu_ids
            },
            text : samples.otu_labels
        };
        
        var data1 = [trace1];

        var layout1 = {
            xaxis:{
                title: "OTU ID"
            },
            height: 500,
            width: 1200
        };

        Plotly.newPlot("bubble", data1, layout1);

    });

};

function getData(id){
    d3.json("samples.json").then((data)=> {
        var metadata = data.metadata;
        //console.log(metadata);

        var result = metadata.filter(resultid => resultid.id.toString()===id)[0];
    
        var demoInfo = d3.select("#sample-metadata");
        demoInfo.html("");

        Object.entries(result).forEach((key) => {   
            demoInfo.append("h4").text(key[0] + ": " + key[1] + "\n");    
        });
    });

}

//event change on id
function optionChanged(id){
    buildPlot(id);
    getData(id);
}

function init(){
    //dropdown
    var dropdown = d3.select("#selDataset");
    d3.json("samples.json").then(function(data){
        console.log(data);
        
        //give options
        data.names.forEach(function(name){
            dropdown.append("option").text(name).property("value");

        });

        getData(data.names[0]);
        buildPlot(data.names[0]);
    });
};

init();