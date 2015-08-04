<html>
    <head>
    </head>
    <body>

        <div id="dashboard-wrapper"></div>

        <script src="/build/auth0-dashboard-widget.js"></script>
        <script type="text/javascript">
            var widget = new Auth0DasboardWidget('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJqY05ZOHd4YVoxWnVRYjhldlJJSGgzYkt3V0dWdEdqZyIsInNjb3BlcyI6eyJ1c2VycyI6eyJhY3Rpb25zIjpbInJlYWQiXX19LCJpYXQiOjE0Mzg2Mjg3NzYsImp0aSI6IjcxZTllYzRiZGY3MDA4ZDYwNTc2MzBjYzE2Y2JiMzg0In0.nbeuNOIVM6N_yvcNRbpJh9cyixkDawRdDJ09AjZceVg','wptest.auth0.com', {

                charts:[
                    {
                        name:'age',
                        url:'/data/ages.json',
                        type:'pie'
                    },
                    {
                        name:'age_bars',
                        url:'/data/ages.json',
                        type:'bar'
                    }
                ]


            });
            widget.show('#dashboard-wrapper');
        </script>
    </body>
</html>
