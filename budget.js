
(function(){

    //IE9+ http://youmightnotneedjquery.com/
    function ready(fn) {
        if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    ready(setupPieChart);


    function setupPieChart(data) {
        console.log(data);
        var proportions = [
            {
                "name": "Military",
                "total": 686,
                "url": "https://www.thebalance.com/department-of-defense-what-it-does-and-its-impact-3305982",
                "tooltip": "Fights wars"
            },
            {
                "name": "Health & Human Services",
                "total": 70,
                "url": "https://www.hhs.gov/about/index.html",
                "tooltip": "Fosters advances in medicine, public health, and social services."
            },
            {
                "name": "Education",
                "total": 59.9,
                "url": "https://en.wikipedia.org/wiki/United_States_Department_of_Education",
                "tooltip": "Establishies policy for, administers and coordinates most federal assistance to education, collect data on US schools, and to enforce federal educational laws regarding privacy and civil rights"
            },
            {
                "name": "Veteran Affairs",
                "total": 83.1,
                "url": "https://en.wikipedia.org/wiki/United_States_Department_of_Veterans_Affairs",
                "tooltip": "Provides healthcare services to eligible military veterans at VA medical centers and outpatient clinics located throughout the country; several non-healthcare benefits including disability compensation, vocational rehabilitation, education assistance, home loans, and life insurance; and provides burial and memorial benefits to eligible veterans and family members."
            },
            {
                "name": "Homeland Security",
                "total": 52.7,
                "url": "https://en.wikipedia.org/wiki/United_States_Department_of_Homeland_Security",
                "tooltip": "Protects the United States within, at, and outside its borders. Its stated goal is to prepare for, prevent, and respond to domestic emergencies, particularly terrorism."
            },
            {
                "name": "Energy Dept",
                "total": 29.2,
                "url": "https://en.wikipedia.org/wiki/United_States_Department_of_Energy",
                "tooltip": "Responsibilities include the nation's nuclear weapons program, nuclear reactor production for the United States Navy, energy conservation, energy-related research, radioactive waste disposal, and domestic energy production."
            },
            {
                "name": "Nuclear Security",
                "total": 15.1,
                "url": "https://en.wikipedia.org/wiki/National_Nuclear_Security_Administration",
                "tooltip": "Maintains and enhances the safety, security, and effectiveness of the US nuclear weapons stockpile without nuclear explosive testing; works to reduce the global danger from weapons of mass destruction; provides the United States Navy with nuclear propulsion; and responds to nuclear and radiological emergencies in the United States and abroad."
            },
            {
                "name": "Housing and Urban Development",
                "total": 29.2,
                "url": "https://en.wikipedia.org/wiki/United_States_Department_of_Housing_and_Urban_Development",
                "tooltip": "Responsible for programs concerned with the Nation'shousing needs, fair housing opportunities, and improvement and development of the Nation's communities."
            },
            {
                "name": "State Dept",
                "total": 40.3,
                "url": "https://en.wikipedia.org/wiki/United_States_Department_of_State",
                "tooltip": "Advises the President and represents the country in international affairs and foreign policy issues."
            },
            {
                "name": "NASA",
                "total": 19.9,
                "url": "https://en.wikipedia.org/wiki/NASA",
                "tooltip": "Responsible for the civilian space program, as well as aeronautics and aerospace research"
            },
            {
                "name": "All Other Agencies",
                "total": 133.1,
                "url": "",
                "tooltip": ""
            }
        ];
        var dimensions = knuthfisheryates2(proportions);

        var percent = 100/proportions.length;

        for (var i = 0; i < proportions.length; i++) {
            proportions[i].proportion = percent;
            proportions[i].format = { color: "#2665da", label: proportions[i].name};
        }

        var setup = {
            canvas: document.getElementById('piechart'),
            radius: 0.9,
            collapsing: true,
            proportions: proportions,
            drawSegment: drawSegmentOutlineOnly,
            onchange: onPieChartChange
        };

        var newPie = new DraggablePiechart(setup);

        function drawSegmentOutlineOnly(context, piechart, centerX, centerY, radius, startingAngle, arcSize, format, collapsed) {

            if (collapsed) { return; }

            // Draw segment
            context.save();
            var endingAngle = startingAngle + arcSize;
            context.beginPath();
            context.moveTo(centerX, centerY);
            context.arc(centerX, centerY, radius, startingAngle, endingAngle, false);
            context.closePath();

            context.fillStyle = '#f5f5f5';
            context.fill();
            context.stroke();
            context.restore();

            // Draw label on top
            context.save();
            context.translate(centerX, centerY);
            context.rotate(startingAngle);

            var fontSize = Math.floor(context.canvas.height / 40);
            var dx = radius - fontSize;
            var dy = centerY / 10;

            context.textAlign = "right";
            context.font = fontSize + "pt Helvetica";
            context.fillText(format.label, dx, dy);
            context.restore();
        }

        function onPieChartChange(piechart) {

            var table = document.getElementById('proportions-table');
            var percentages = piechart.getAllSliceSizePercentages();

            var labelsRow = '<tr>';
            var propsRow = '<tr>';
            for(var i = 0; i < proportions.length; i += 1) {
                labelsRow += '<a href="'+proportions[i].url+'"></a><th>' + proportions[i].format.label + '</th></a>';

                var v = '<var>' + percentages[i].toFixed(0) + '%</var>';
                var plus = '<div id="plu-' + dimensions[i] + '" class="adjust-button" data-i="' + i + '" data-d="-1">&#43;</div>';
                var minus = '<div id="min-' + dimensions[i] + '" class="adjust-button" data-i="' + i + '" data-d="1">&#8722;</div>';
                propsRow += '<td>' + v + plus + minus + '</td>';
            }
            labelsRow += '</tr>';
            propsRow += '</tr>';

            table.innerHTML = labelsRow + propsRow;

            var adjust = document.getElementsByClassName("adjust-button");

            function adjustClick(e) {
                var i = this.getAttribute('data-i');
                var d = this.getAttribute('data-d');

                piechart.moveAngle(i, (d * 0.1));
            }

            for (i = 0; i < adjust.length; i++) {
                adjust[i].addEventListener('click', adjustClick);
            }

        }

        /*
         * Array sorting algorithm
         */
        function knuthfisheryates2(arr) {
            var temp, j, i = arr.length;
            while (--i) {
                j = ~~(Math.random() * (i + 1));
                temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }

            return arr;
        }
    }

})();



