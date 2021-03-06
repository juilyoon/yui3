YUI.add('charts-objectstyles-tests', function(Y) {
    var suite = new Y.Test.Suite('charts-objectstyles-tests example test suite'),
        _getClassName = Y.ClassNameManager.getClassName,
        CHART_BOUNDINGBOX = "." + _getClassName("cartesianchart"),
        CHART_CONTENTBOX = "." + _getClassName("cartesianchart-content"),
        CHART_SERIESMARKER = "." + _getClassName("seriesmarker"),
        CHART_TOOLTIP = "." + _getClassName("chart-tooltip"),
        CONFIG = Y.config,
        WINDOW = CONFIG.win,
        DOCUMENT = CONFIG.doc,
        isTouch = ((WINDOW && ("ontouchstart" in WINDOW)) && !(Y.UA.chrome && Y.UA.chrome < 6)),
        isMouse = !isTouch,
        SHOWTOOLTIPEVENT = isTouch ? "tap" : "mouseover",
        HIDETOOLTIPEVENT = isTouch ? "tap" : "mouseout",
        TOTAL_MARKERS = 18,
        ONE = 1;

    suite.add(new Y.Test.Case({
        name: "Charts Object Styles Tests",

        dataProvider: [
            {date:"1/1/2010", miscellaneous:2000, expenses:3700, revenue:2200}, 
            {date:"2/1/2010", miscellaneous:5000, expenses:9100, revenue:100}, 
            {date:"3/1/2010", miscellaneous:4000, expenses:1900, revenue:1500}, 
            {date:"4/1/2010", miscellaneous:3000, expenses:3900, revenue:2800}, 
            {date:"5/1/2010", miscellaneous:500, expenses:7000, revenue:2650},
            {date:"6/1/2010", miscellaneous:3000, expenses:4700, revenue:1200}  
        ],

        seriesKeys: [
            "miscellaneous",
            "expenses",
            "revenue"
        ],

        seriesDisplayNames: {
            miscellaneous: "Miscellaneous",
            expenses: "Expenses",
            revenue: "Deductions"
        },

        getSeriesDisplayName: function(seriesKey)
        {
            return this.seriesDisplayNames[seriesKey];
        },
        
        _should: {
            ignore: {
                testMouseEvents:  isTouch,
                testTouchEvents: isMouse
            }
        },

        testChartLoaded : function()
        {
            var boundingBox = Y.all(CHART_BOUNDINGBOX),
                contentBox = Y.all(CHART_CONTENTBOX); 
            Y.Assert.areEqual(ONE, boundingBox.size(), "There should be one chart bounding box.");
            Y.Assert.areEqual(ONE, contentBox.size(), "There should be one chart contentBox.");
        },

        testSeriesMarkerLoaded : function()
        {
            var seriesMarkers = Y.all(CHART_SERIESMARKER);
            Y.Assert.areEqual(TOTAL_MARKERS, seriesMarkers.size(), "There should be 5 markers.");
        },

        testMouseEvents: function()
        {
            var result = null,
                eventNode = CHART_SERIESMARKER,
                handleEvent = function(event) 
                {
                    result = event;
                },
                seriesIndex,
                index,
                id,
                lastDash,
                contents,
                handler = Y.delegate(SHOWTOOLTIPEVENT, Y.bind(handleEvent, this), CHART_CONTENTBOX, eventNode),
                seriesMarkers = Y.all(CHART_SERIESMARKER),
                tooltip = Y.all(CHART_TOOLTIP).shift();
            seriesMarkers.each(function(node) {
                var domNode = node.getDOMNode(), 
                    xy = node.getXY(),
                    x = xy[0] - Y.one('document').get('scrollLeft'),
                    y = xy[1] - Y.one('document').get('scrollTop');
                Y.Event.simulate(domNode, SHOWTOOLTIPEVENT, {
                    clientX:x,
                    clientY:y
                });
                id = result.currentTarget.get("id");
                lastDash = id.lastIndexOf("_");
                index = id.substr(lastDash + 1);
                seriesIndex = id.charAt(lastDash - 1);
                contents = this.markerLabelFunction(seriesIndex, index);
                Y.Assert.areEqual(contents, tooltip.get("innerHTML"), "The contents of the tooltip should be " + contents);
                Y.Event.simulate(domNode, HIDETOOLTIPEVENT);
            }, this);
        },

        testTouchEvents: function()
        {
            var result = null,
                test = this,
                timeout = 1000,
                interval = 10,
                eventNode = CHART_SERIESMARKER,
                index,
                id,
                lastDash,
                contents,
                node,
                seriesMarkers = Y.all(CHART_SERIESMARKER),
                tooltip = Y.all(CHART_TOOLTIP).shift(),
                condition = function() {
                    return tooltip.getStyle("visibility") == "visible";
                },
                checkAndFireEvent = function(seriesMarkers)
                {
                    node = seriesMarkers.shift();
                    if(node)
                    {
                        node.simulateGesture("tap", {
                            point: [3, 3],
                            duration: 0
                        }, function() {
                           test.resume(function() {
                                test.poll(condition, interval, timeout, success, failure);
                            });
                        }); 
                        test.wait();        
                    }

                },
                success = function() {
                    id = node.get("id");
                    lastDash = id.lastIndexOf("_");
                    index = id.substr(id.lastIndexOf("_") + 1);
                    seriesIndex = id.charAt(lastDash - 1);
                    seriesKey = this.seriesKeys[seriesIndex];
                    contents = this.markerLabelFunction(seriesIndex, index);
                    Y.Assert.areEqual(contents, tooltip.get("innerHTML"), "The contents of the tooltip should be " + contents);
                    checkAndFireEvent(seriesMarkers);
                },
                failure = function() {
                    Y.Assert.fail("Example does not seem to have executed within " + timeout + " seconds.");
                };
            checkAndFireEvent(seriesMarkers);
        },
        
        markerLabelFunction: function(seriesIndex, index)
        {
            var seriesKey = this.seriesKeys[seriesIndex],
                seriesDisplayName = this.getSeriesDisplayName(seriesKey),
                item = this.dataProvider[index];
            return Y.Node.create("<div><div>Date: " + item.date + "<br>" + seriesDisplayName + ": " + item[seriesKey] + "</div></div>").get("innerHTML");
        }
    }));
    
    suite.add(new Y.Test.Case({
        name: "Manual Test",

        "Test chart loaded" : function()
        {
            Y.Assert.isTrue((false), "Ensure there is a column chart with a single combo (line and markers) series on the page. The columns should be purple and grey. The line and its markers should be orange."); 
        },

        "Test axes" : function()
        {
            Y.Assert.isTrue((false), "Ensure the bottom axis' labels have a rotation of -45 degrees. Ensure the numeric axis is on the right of the chart."); 
        },

        "Test marker interactivity" : function()
        {
            Y.Assert.isTrue((false), "Mouse over markers and ensure a tooltip appears."); 
        }
    }));
    
    Y.Test.Runner.add(suite);
}, '' ,{requires:['classnamemanager', 'event-touch', 'node', 'node-event-simulate']});

