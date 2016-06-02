function outVotes(groupBy="party")
{
	// Check that we're grouping by something valid.
	if(["party", "vote", "state"].indexOf(groupBy)==-1) { groupBy = "party"; }
	// Pull out every filtered bit of data.
	var filteredVotes = globalPartyDimension.top(Infinity);
	var groupings = {};

	// Iterate through the people, adding them to a dict of arrays by party
	for(var i=0;i!=filteredVotes.length;i++)
	{
		var voteSubset = {
			"name": filteredVotes[i]["name"], 
			"party": filteredVotes[i]["party"], 
			"vote": filteredVotes[i]["vote"], 
			"state": filteredVotes[i]["state"],
			"id": filteredVotes[i]["id"]
		};
		if(groupings[filteredVotes[i][groupBy]] != undefined) {groupings[filteredVotes[i][groupBy]].push(voteSubset); }
		else { groupings[filteredVotes[i][groupBy]] = [voteSubset]; }
	}

	// Output table
	var sortedKeys = Object.keys(groupings).sort();
	var baseTable = $("<table></table>").css("width","100%");
	var tr = $("<tr></tr>");
	var td = $("<td></td>").attr("valign","top");
	var rowCount=0;
	var i=0; var colCount=0;
	for(var key in sortedKeys)
	{
		groupings[sortedKeys[key]] = groupings[sortedKeys[key]].sort(function(a,b){return a["name"] < b["name"] ? -1 : (a["name"] > b["name"] ? 1 : 0);});
		var partyLabel = $("<div></div>").css("padding-bottom","20px");
		$("<p><strong>"+groupBy+": "+sortedKeys[key]+"</strong></p>").css("text-decoration","underline").appendTo(partyLabel);
		for(var j in groupings[sortedKeys[key]])
		{
			var person = groupings[sortedKeys[key]][j];
			var outLabel = "";
			if(groupBy=="party")
			{
				outLabel = person["name"]+" ("+person["state"]+"): "+person["vote"];
			}
			else if(groupBy=="state")
			{
				outLabel = person["name"]+" ("+person["party"].substr(0,1)+"): "+person["vote"];
			}
			else
			{
				outLabel = person["name"]+" ("+person["party"].substr(0,1) + "-" +person["state"] + ")";
			}
			
			var p = $("<p></p>");
			$("<a></a>").attr("href","/person/"+person["id"])
					.html(outLabel).appendTo(p);
			p.appendTo(partyLabel);
		}
		partyLabel.appendTo(td);
		rowCount+= parseInt(j)+1;
		i=i+1;
		if(rowCount>(filteredVotes.length/4) || (colCount==0 && i==sortedKeys.length-1))
		{
			colCount=colCount+1;
			rowCount=0;
			td.appendTo(tr)
			td = $("<td></td>").attr("valign","top");
		}
		else { console.log(rowCount); console.log(colCount); console.log(filteredVotes.length); console.log(i); console.log(sortedKeys.length); }
	}
	if(td.html().length)
	{
		td.appendTo(tr);
	}
	tr.appendTo(baseTable);
	$("#voteList").html(baseTable);
}
