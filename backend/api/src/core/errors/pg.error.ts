export const pgErrorMessages: Record<string, string> = {
  "duplicate key value violates unique constraint": "Duplicate entry",
  // "violates foreign key constraint": "Foreign key violation",
  "violates not-null constraint": "Not null constraint violation",
  "value too long for type": "Value too long for column",
  "invalid input syntax for type": "Invalid input format",
  // "division by zero": "Division by zero",
  // "syntax error at or near": "Query syntax error",
  // "relation does not exist": "Undefined table",
  // "column does not exist": "Undefined column",
};
