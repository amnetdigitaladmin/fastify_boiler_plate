import * as Joi from 'joi';
// import { Iuser } from '../../models/schemas/user';
// import { Itenant } from '../../models/schemas/tenant';
// import { IActionItems } from '../../models/schemas/action-items';
// import { IMenuConfig } from '../../models/schemas/menu-config';
// import { Irole } from '../../models/schemas/role';
// import { IuserRole } from '../../models/schemas/user-roles';
// import { ItenantConfig } from '../../models/schemas/tenant-config-pricing';
// import { ItenantInvoice } from '../../models/schemas/tenant-invoice';


class validateParameters {
     userSchema = Joi.object({
        email: Joi.string().email().required(),
        first_name: Joi.string().min(3).max(30),
        company: Joi.string().min(3).max(30),
        last_name: Joi.string().min(3).max(30),
        mobile: Joi.string().regex(/^[0-9]{10}$/).messages({'string.pattern.base': `Phone number must have 10 digits.`}).required(),
        address:Joi.string().required(),
        city:Joi.string().required(),
        state:Joi.string().required(),
        country:Joi.string().required(),
        pincode: Joi.string().pattern(/^\d{6}$/).required(),
        roleId: Joi.number().required(),
      });

      userUpdateSchema = Joi.object({
        email: Joi.string().email(),
        first_name: Joi.string().min(3).max(30),
        last_name: Joi.string().min(3).max(30),
        company: Joi.string().min(3).max(30),
        mobile: Joi.string().regex(/^[0-9]{10}$/).messages({'string.pattern.base': `Phone number must have 10 digits.`}).required(),        address:Joi.string().required(),
        city:Joi.string().required(),
        state:Joi.string().required(),
        country:Joi.string().required(),
        pincode: Joi.string().pattern(/^\d{6}$/).required(),
        roleId: Joi.number().required(),
        is_active: Joi.boolean().required()
      });

      assignClientSchema = Joi.object({       
        clientsIds: Joi.array()
          .items(Joi.number().required())
          .min(1) // optional: ensures at least one ID is provided
          .required()
      });

      roleSchema = Joi.object({
        name: Joi.string().required(),
        // industryId: Joi.number().required(),
        // roleId: Joi.number().required(),
        // questionIds: Joi.array()
      });
      roleUpdateSchema = Joi.object({
        name: Joi.string().required(),
        industryId: Joi.number().required(),
        questionIds: Joi.array(),
        removequestionIds: Joi.array(),
        roleId: Joi.number().required(),
      });
      questionSchema = Joi.object({
        question: Joi.array().required(),
        type: Joi.string().required(),
        name: Joi.string().required()
      });
      campaignSchema = Joi.object({
        questions: Joi.array().required(),
        roleId: Joi.number().required(),
        role_name: Joi.string().required(),
        is_email_sent: Joi.boolean().required(),
        is_mobile_sms_sent: Joi.boolean().required(),
        customerId: Joi.number().required(),
      });
      verifyOTPSchema = Joi.object({
        OTP: Joi.string().required(),
        campaignId: Joi.number().required(),
      });
      forgotPasswordOTPSchema = Joi.object<any>({
        email: Joi.string().email().required(),
    });
    verifySalesRepOTPSchema = Joi.object<any>({
      email: Joi.string().email().required(),
      otp: Joi.string().required(),
      password: Joi.string().required(),
  });

  requestSchema = Joi.object({     
   amc_id: Joi.number().integer().positive().required(),
  requestAreaInsqft: Joi.string().pattern(/^\d+$/).required().messages({
    'string.pattern.base': 'requestAreaInsqft must be a number in string format',
  }),
  });

  requestUpdateSchema = Joi.object({
     requestAreaInsqft: Joi.string().pattern(/^\d+$/).required().messages({
    'string.pattern.base': 'requestAreaInsqft must be a number in string format',
  }),
  });

  AMCSchema = Joi.object({
    amc_name: Joi.string().required(),
    client_name: Joi.string().required(),
    client_id: Joi.number().required(),
    start_date: Joi.string().required(),
    end_date: Joi.string().required(),
    area_in_sqft: Joi.number().required(),
    category_id: Joi.number().required(),
    sub_category_id: Joi.number().required(),
    utilisation_per_year: Joi.number().required(),
  });
  AMCUpdateSchema = Joi.object({
    amc_name: Joi.string().required(),
    client_name: Joi.string().required(),
    client_id: Joi.number().required(),
    start_date: Joi.string().required(),
    end_date: Joi.string().required(),
    area_in_sqft: Joi.number().required(),
    category_id: Joi.number().required(),
    sub_category_id: Joi.number().required(),
    utilisation_per_year: Joi.number().required(),
    status: Joi.string().required().valid("Active", "InActive")
  });
  acceptRejectSchema = Joi.object({
    comments: Joi.string().allow('', null).optional(),
    status: Joi.string().required().valid("Accepted", "Rejected")
  });

  workflowSchema = Joi.object({
    order: Joi.number().required()
  });

  feedbackSchema = Joi.object({
    order: Joi.number().required(),
    comments: Joi.string().allow('', null).optional(),
    rating: Joi.number().precision(1).min(0).max(5).allow(null).optional()
  });

  categorySchema = Joi.object({
    category: Joi.string().required(),
  });

  subCategorySchema = Joi.object({
    subcategory: Joi.string().required(),
    category_id: Joi.number().required(),
  });

  updateSubCategorySchema = Joi.object({
    new_subcatogires: Joi.array().required(),
    removed_subcatogires: Joi.array().required(),
    category_id: Joi.number().required(),
  });
//     //login validation rules
//     loginSchema = Joi.object({
//         email: Joi.string().trim().required().label('email'),
//         password: Joi.string().trim().required().label('Password'),
//         tenantName:Joi.string().label('tenantName').required()
//     });

//     superadminLoginSchema = Joi.object({
//         email: Joi.string().trim().required().label('email'),
//         password: Joi.string().trim().required().label('Password'),       
//     });

//     mamLoginSchema = Joi.object({
//         email: Joi.string().trim().required().label('email'),
//         password: Joi.string().trim().required().label('Password')
//     });

//     //user validation rules
//     userSchema = Joi.object<Iuser>({
//         email: Joi.string().email().required(),
//         first_name: Joi.string().min(3).max(30).required(),
//         last_name: Joi.string().min(3).max(30),
//         mobile: Joi.string()
//             .regex(/^[0-9]{10}$/)
//             .messages({ 'string.pattern.base': `Phone number must have 10 digits.` })
//             .required(),
//         gender: Joi.string().required().valid("Male", "Female", "Others"),
//         // marital_status: Joi.string().valid("Single","Married"),
//         employee_id: Joi.string().required(),
//         // blood_group: Joi.string(),
//         // date_of_birth: Joi.string(),
//         // date_of_joining: Joi.string(),
//         // present_address: Joi.string(),
//         // present_address_city: Joi.string(),
//         // present_address_state: Joi.string(),
//         // present_address_country: Joi.string(),
//         // present_address_pincode: Joi.string()
//         //     .regex(/^[0-9]{6}$/)
//         //     .messages({ 'string.pattern.base': `Pincode must have 6 digits.` }),
//         // permanent_address: Joi.string(),
//         // permanent_address_city: Joi.string(),
//         // permanent_address_state: Joi.string(),
//         // permanent_address_country: Joi.string(),
//         // permanent_address_pincode: Joi.string()
//         //     .regex(/^[0-9]{6}$/)
//         //     .messages({ 'string.pattern.base': `Pincode must have 6 digits.` }),            
//         employee_type: Joi.string().required().valid("Permanent", "Contract"),
//         location: Joi.string().required(),
//         manager_id: Joi.string().optional().allow(''),
//         phn_country_code: Joi.string().optional(),
//         avatar: Joi.string().optional(),
//     });

//     //tenant validation rules
//     tenantSchema = Joi.object<Itenant>({
//         name: Joi.string().min(3).max(30).required(),
//         description: Joi.string().min(3).max(300).required(),
//         url: Joi.string().min(3).max(100).required(),
//         email: Joi.string().email().required(),
//         mobile: Joi.string()
//             .regex(/^[0-9]{10}$/)
//             .messages({ 'string.pattern.base': `Phone number must have 10 digits.` })
//             .required(),
//         alternate_mobile: Joi.string().allow('', null),
//         full_name: Joi.string().required(),
//         industries: Joi.array().required(),
//         address: Joi.string().min(3).max(300).required(),
//         logo_url: Joi.string().required(),
//         // is_draft: Joi.boolean().required(),
//         is_invited: Joi.boolean(),
//         created_by: Joi.string(),
//         phn_country_code: Joi.string(),
//         altr_phn_country_code: Joi.string(),
//         signature: Joi.string().required(),

//         // name: Joi.string().alphanum().min(3).max(30).required(),
//     });

//     actionItemSchema = Joi.object<IActionItems>({
//         name: Joi.string().min(3).max(60).required(),
//         description: Joi.string().min(3).max(300).required(),
//         employee_id: Joi.string().required(),
//         manager_id: Joi.string(),
//     });

//     actionItemUpdateSchema = Joi.object<IActionItems>({
//         name: Joi.string().min(3).max(60).required(),
//         description: Joi.string().min(3).max(300).required(),
//     });

//     actionItemUpdateStatusSchema = Joi.object<IActionItems>({
//         status: Joi.string().valid('Not Yet Started', 'InProgress', 'Completed', 'Cancelled').required()
//     });

//     menuConfigSchema = Joi.object<IMenuConfig>({
//         menu_name: Joi.string().min(3).max(30).required(),
//         platform: Joi.string().valid('Web', 'Mobile').required(),
//         active_icon: Joi.string().required(),
//         inactive_icon: Joi.string().required(),
//         active_dark_icon: Joi.string().required(),
//         inactive_dark_icon : Joi.string().required(),
//         order: Joi.number().required(),
//         route: Joi.string().required(),
//         context: Joi.string().valid('A', 'SM', 'AM').required(),
//         // role_id: Joi.string().required(),
//         feature_name: Joi.string().required(),
//         // tenant_id: Joi.string().required(),
//         is_submenu_exist: Joi.boolean().required(),
//         sub_menus: Joi.array(),
//     });
    
//    //tenant Config validation rules
//     tenantConfigSchema = Joi.object<ItenantConfig>({
//         tenant_config_type: Joi.string().required(),
//         tenant_id: Joi.string().required(),
//         pricing_type_basic: Joi.boolean(),
//         pricing_type_starter: Joi.boolean(),
//         pricing_type_pro: Joi.boolean(),
//         pricing_type_enterprise: Joi.boolean(),
//         subscription_start_date: Joi.string().required(),
//         subscription_end_date: Joi.string().required(),
//         currency_type: Joi.string().required(),
//         package: Joi.string().required(),
//         cost: Joi.string().required(),
//     });

//     //tenant Invoice validation rules
//     tenantInvoiceSchema = Joi.object<any>({
//         form: Joi.string().required(),
//         tenant_id: Joi.string().required(),
//         is_draft: Joi.boolean().required(),
//         is_invited: Joi.boolean().required(),
//         invoice_number: Joi.string().required(),
//         invoice_value: Joi.string().required(),
//         subscription_start_date: Joi.string().required(),
//         subscription_end_date: Joi.string().required(),
//         package: Joi.string().required(),
//     });

//     //tenant SSO  validation rules
//     tenantInvoiceSsoSchema = Joi.object<any>({
//         name:Joi.string().required(),
//         // ssoProvider: Joi.string().required(),
//         configurations:Joi.array(),
//         tenant_id: Joi.string().required(),
//         is_SSO_config_enabled: Joi.boolean().required(),
        
//     });

//     tenantSSOProviderSchema = Joi.object<any>({
//         name:Joi.string().required(),
//         tenant_id: Joi.string().required(),
        
//     });

//     //industry validation rules
//     industrySchema = Joi.object<Itenant>({
//         name: Joi.string().min(3).max(45).required()
//     });

//     tenantFeaturesSchema = Joi.object<any>({
//         tenant_id: Joi.string().required(),
//         tenant_features: Joi.array().required()
//     });

//     //role validation rules
//     roleSchema = Joi.object<Irole>({
//         name: Joi.string().min(3).max(45).required(),
//         role_code: Joi.string().required(),
//         description: Joi.string()
//     });

//     //Assign Employees to role validation rules
//     assignEmployeesToRoleSchema = Joi.object<any>({
//         role_id: Joi.string().required(),
//         add_employess: Joi.array().required(),
//         remove_employess: Joi.array().required(),
//     });

//     //Assign Employees to role validation rules
//     forgotPasswordOTPSchema = Joi.object<any>({
//         email: Joi.string().email().required(),
//     });

//     resendOTPSchema = Joi.object<any>({
//         email: Joi.string().email().required(),
//     });

//     verifyOTPSchema = Joi.object<any>({
//         email: Joi.string().email().required(),
//         otp: Joi.string().required(),
//         password: Joi.string().required(),
//     });

//     FilterSchema = Joi.object<any>({
//         offset: Joi.string(),
//         limit: Joi.string(),
//         order_by: Joi.string(),
//         sort_order: Joi.string(),
//         from_date: Joi.string(),
//         to_date: Joi.string(),
//         status: Joi.string(),
//         search_text: Joi.string().min(1).max(32)
//     })

//     UserImportSchema = Joi.object<any>({
//         CSVString: Joi.string().required()
//     })
}

export default new validateParameters