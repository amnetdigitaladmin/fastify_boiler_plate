import * as _ from 'lodash';
const { v4: uuidv4 } = require('uuid');
import * as bcrypt from 'bcrypt';



class common {
  public async stringToBinary64(pass: any) {
    let binaryResult = "";
    for (let i = 0; i < pass.length; i++) {
      const binaryChar = pass[i].charCodeAt(0).toString(2);
      binaryResult += "0".repeat(8 - binaryChar.length) + binaryChar;
    }
    return Buffer.from(binaryResult).toString("base64");
  }

  public async generateOTP() {      
    // Generate a random number between 1000 and 9999  
    const otp:any = Math.floor(1000 + Math.random() * 9000);  
    return otp.toString(); // Return OTP as a string for consistency 
  }

  public async bynary64ToString(data:any) {
    var binary = Buffer.from(data, 'base64').toString('utf-8');
    const binaryChunks:any = binary.match(/.{1,8}/g);
    // Convert each chunk to a decimal number and then to a character
    return binaryChunks.map((chunk:any) => String.fromCharCode(parseInt(chunk, 2))).join('');
};

public async removeSpacesFromObjectKeys(obj:any) {
  const newObj:any = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = key.trim();
      newObj[newKey] = obj[key];
    }
  }
  return newObj;
}

  public async getArrayFromString(inputString: string): Promise<number[]> {
    return await _.map(inputString.toString().split(","), (val) => parseInt(val));
  }

  // public async getArrayFilterString(inputString: string): Promise<any[]> {
  //   let outPutObjIds: any = inputString.toString().split(",").map((item: any) => { return new ObjectId(item) })
  //   return outPutObjIds
  // }

  public async newGuid() {
    return await uuidv4();
  }

  public async asyncForEach<T>(
    array: Array<T>,
    callback: (item: T, index: number) => void
  ) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index);
    }
  }

  //import payload generate
  public async getPayload(columnMapping: any, record: any) {
    record = await this.removeSpacesFromObjectKeys(record)
    const request: any = {
      created_by: record.created_by,
    };
    const error: any = [];
    for (const col of columnMapping) {
      if (
        col.is_optional === false &&
        (record[col.display_name] === undefined ||
          record[col.display_name].length === 0)
      ) {
        error.push(`"${col.display_name} column is missing"`);
      } else if (
        col.is_optional === true &&
        record[col.display_name] === undefined
      ) {
        request[col.column_name] = "";
      } else {
        request[col.column_name] = record[col.display_name];
      }
    }
    if (error.length > 0) {
      return { status: "error", message: error };
    }
    return request;
  }

  public async getErrorMessage(err: any, columnMapping: any) {
    let errorMessage = err.message;
    if (err.code == 422 && err.data != null) {
      errorMessage = "";
      err.data.forEach(async (element: { message: string }) => {
        errorMessage += element.message + " ";
      });
      let columnName = errorMessage.match(/(["'])(?:(?=(\\?))\2.)*?\1/g);
      if (columnName.length) {
        columnName = columnName[0];
        const columnMapped = columnMapping.find(
          (x: any) => x.column_name == columnName.replace(/\'/gi, "")
        );
        if (columnMapped)
          errorMessage = errorMessage.replace(
            /(["'])(?:(?=(\\?))\2.)*?\1/g,
            `'${columnMapped.display_name}'`
          );
      }
    }
    console.log(errorMessage)
    return errorMessage;
  }
  //user validations
  excelDateFormat = "DD-MM-YYYY";
  genderValidation = ["Male", "Female", "Others"];
  maritalValidation = ["Single", "Married"];
  empTypeValidation = ["Permanent", "Contract"]; 

  public async validateMobileNumber(mobileNumber:any) {
    const regex = /^\d+$/;
    return regex.test(mobileNumber);
  }
  public async validateName(name:any) {
    const regex = /^[a-zA-Z ]+$/;
    return regex.test(name);
  }
  public async validateEmail(email:any) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
  public async alphaNumericRegex(email:any) {
    const regex =/^[a-zA-Z0-9]*$/;
    return regex.test(email);
  }
  public async removeSpace(str:string) {
    str = str.replace(/\s/g, '')
    return str;
  }

  public async containsSpecialCharacters(input: string) {
    // Regular expression for special characters
    const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/;
    return specialCharPattern.test(input);
  }

   // Use a separate method to hash passwords
   public async hashPassword(plainPassword: string): Promise<string> {
    const saltRounds = 10; 
    return await bcrypt.hash(plainPassword, saltRounds);
}


}

export default new common();
