function InitWorkspace()
{
var graph = new joint.dia.Graph;
var paper = new joint.dia.Paper({
    el: $('#myholder'),
    width: 1210, height: 400, gridSize: 5,
    model: graph,
    defaultLink: GetLink(),
    validateConnection: function(cellViewS, magnetS, cellViewT, magnetT, end, linkView) {
						return ValidateConnection(cellViewS, magnetS, cellViewT, magnetT, end, linkView)
						},
    validateMagnet: function(cellView, magnet) {
        // Note that this is the default behaviour. Just showing it here for reference.
        // Disable linking interaction for magnets marked as passive (see below `.inPorts circle`).
        return magnet.getAttribute('magnet') !== 'passive';
    },
	markAvailable: true
});

graph.on('change:source change:target', function(link) {
    if (link.get('source').id && link.get('target').id) {
        console.log("Link has been changed")
    }
})

		console.log("loaded");
		$(".dragme").draggable({ helper: "clone",stack: ".drophere", cursor: "move"});
			
		
		$( ".drophere" ).droppable({
				activeClass: "activeDroppable",
				hoverClass: "hoverDroppable",
				accept: ":not(.ui-sortable-helper)",
				
				stop: function(event, ui) {
					// Show dropped position.
					var Stoppos = $(this).position();
					console.log(Stoppos.left);
					console.log(Stoppos.top);
					console.log("asda");
											},
											
				drop: function( event, ui ) {
					console.log("dropped");
					 // position of the draggable minus position of the droppable
        // relative to the document
					var newPosX = ui.offset.left - $(this).offset().left;
					var newPosY = ui.offset.top - $(this).offset().top;
					console.log(newPosX);
					console.log(newPosY);
					AddBlock(graph,'Sine','array','logic',newPosX,newPosY-50);
											}
});

return graph
}

function GetLink()
{
var link = new joint.dia.Link(
	{
        attrs: { '.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z' } ,
		'.marker-source': { fill: 'red', d: 'M 10 0 L 0 5 L 10 10 z' },
		'.connection': { stroke: 'blue' },}
    });
link.set('smooth',true);
return link;
}


function ValidateConnection(cellViewS, magnetS, cellViewT, magnetT, end, linkView) {
        // Prevent linking from input ports.
        if (magnetS && magnetS.getAttribute('type') === 'input-array') return false;
        // Prevent linking from output ports to input ports within one element.
        if (cellViewS === cellViewT) return false;
        // Prevent linking to input ports.
		if (magnetS && magnetT)
		{
			var source_types = magnetS.getAttribute('type').split('-');
			var source_flowtype = source_types[0];
			var source_datatype = source_types[1];
			var target_types = magnetT.getAttribute('type').split('-');
			var target_flowtype = target_types[0];
			var target_datatype = target_types[1];
			if(target_flowtype != "input") return false;
			if(target_datatype != source_datatype) return false;
		}
		return true;
}

function showAddress(address)
{
    alert("This is address :"+address);
};

function AddBlock(graph, name, inputType,outputType,xpos, ypos)
{
 var model = new joint.shapes.devs.Model({
    position: { x: xpos, y: ypos },
    size: { width: 90, height: 90 },
    inPorts: ['in1','in2'],
    outPorts: ['out'],
    attrs: {
        '.label': { text: name, 'ref-x': .4, 'ref-y': .2 , fill: '#000010'},
        rect: { fill: '#FFFFFF', rx: 5, ry: 5, 'stroke-width': 2, stroke: 'black' },
        '.inPorts circle': { fill: '#16A085', magnet: 'passive', type: 'input'+'-'+inputType },
        '.outPorts circle': { fill: '#E74C3C', type: 'output'+'-'+ outputType}
    }
});
graph.addCell(model);
}


var mygraph = InitWorkspace();


