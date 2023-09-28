import { ValidationError } from "../interface/Error";

export const simplifyErrors = (originalData: any) => {
    if (!originalData || !originalData.details || !Array.isArray(originalData.details)) {
      return [];
    }
  
    return originalData.details.map((detail: any) => ({
      message: detail.message,
      path: detail.path.join('.'),
      type: detail.type,
    }));
}
