class ImportColumns {
  admin = [       
    {display_name: "First Name",column_name: "first_name", is_optional: false}, 
    {display_name: "Last Name",column_name: "last_name", is_optional: false},  
    {display_name: "Email Id",column_name: "email", is_optional: false},
    {display_name: "Mobile Number",column_name: "mobile", is_optional: false},
    {display_name: "Address",column_name: "address", is_optional: true},
    {display_name: "City",column_name: "city", is_optional: true},
    {display_name: "State",column_name: "state", is_optional: true},
    {display_name: "Country",column_name: "country", is_optional: true},
    {display_name: "Pincode",column_name: "pincode", is_optional: true},
  ];

  business_partner = [       
    {display_name: "First Name",column_name: "first_name", is_optional: false}, 
    {display_name: "Last Name",column_name: "last_name", is_optional: false},  
    {display_name: "Email Id",column_name: "email", is_optional: false},
    {display_name: "Mobile Number",column_name: "mobile", is_optional: false},
    {display_name: "Address",column_name: "address", is_optional: true},
    {display_name: "City",column_name: "city", is_optional: true},
    {display_name: "State",column_name: "state", is_optional: true},
    {display_name: "Country",column_name: "country", is_optional: true},
    {display_name: "Pincode",column_name: "pincode", is_optional: true},
  ];

  client = [       
    {display_name: "Company",column_name: "company", is_optional: false},
    {display_name: "Email Id",column_name: "email", is_optional: false},
    {display_name: "Mobile Number",column_name: "mobile", is_optional: false},
    {display_name: "Address",column_name: "address", is_optional: true},   
    {display_name: "City",column_name: "city", is_optional: true},
    {display_name: "State",column_name: "state", is_optional: true},
    {display_name: "Country",column_name: "country", is_optional: true},
    {display_name: "Pincode",column_name: "pincode", is_optional: true},
    ];
}
export default new ImportColumns()
