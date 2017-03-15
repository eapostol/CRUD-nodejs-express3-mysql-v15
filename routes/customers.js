/**
 * Created by Edward_J_Apostol on 2017-03-14.
 */

exports.add = function(req, res){
    res.render('add_customer',{page_title:"Add Customers-Node.js"});
};

exports.list = function(req, res){
    debugger;
    console.log(req.body);
    debugger;
    req.getConnection(function(err,connection){

        var query = connection.query('SELECT * FROM customer',function(err,rows)
        {

            if(err)
                console.log("Error Selecting : %s ",err );

            res.render('customers',{page_title:"Customers - Node.js",data:rows});


        });

        //console.log(query.sql);
    });

};

exports.edit = function (req,res){

    var id = req.params.id;

    var connFn = function(err,connection){

        var q = 'SELECT * FROM customer WHERE id = ?';
        var qFn = function(err,rows) {

            if(err){
                console.log("Error Selecting : %s ",err );
            }
            res.render('edit_customer',{page_title:"Edit Customers - Node.js",data:rows});
        };
        connection.query(q,[id],qFn);
    };
    req.getConnection(connFn);

};

/*Save the customer*/
exports.save = function(req,res){
    debugger;
    console.log(req.body);
    debugger;
    var input = JSON.parse(JSON.stringify(req.body));

    var connFn = function (err, connection) {

        var data = {

            name    : input.name,
            address : input.address,
            email   : input.email,
            phone   : input.phone

        };
        var q = "INSERT INTO customer set ? ";
        var qFn = function(err, rows)
        {

            if (err)
                console.log("Error inserting : %s ",err );

            res.redirect('/customers');

        };

        var query = connection.query(q,data, qFn);

        // console.log(query.sql); get raw query

    };

    req.getConnection(connFn);
};

/*Save edited customer (i.e. update) */
exports.save_edit = function(req,res){

    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.params.id;

    var connFn = function (err, connection) {

        var data = {

            name    : input.name,
            address : input.address,
            email   : input.email,
            phone   : input.phone

        };
        var q = "UPDATE customer set ? WHERE id = ? ";
        var qFn = function(err, rows)
        {

            if (err)
                console.log("Error Updating : %s ",err );

            res.redirect('/customers');

        };stack

        connection.query(q,[data,id], qFn);

    };

    req.getConnection(connFn);
};

exports.delete_customer = function(req,res){

    var id = req.params.id;
    var connFn = function (err, connection) {

        var q = "DELETE FROM customer  WHERE id = ? ";
        var qFn = function(err, rows)
        {
            if(err)
                console.log("Error deleting : %s ",err );

            res.redirect('/customers');
        };

        connection.query(q,[id],qFn);

    };

    req.getConnection(connFn);
};
