import bcrypt from "bcryptjs";
import type { ProductFilters, QueryParams } from "./types";

const { SALTS_ROUNDS } = process.env;

interface FormatDate {
  date: string;
  time: string;
  full: string;
}

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(Number(SALTS_ROUNDS));
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

export const comparePassword = async (
  password: string,
  hashedPassword: string,
) => {
  return await bcrypt.compare(password, hashedPassword);
};

export const formatDate = (dateString: string): FormatDate => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: timezone,
  };

  const formatter = new Intl.DateTimeFormat("en-GB", options);
  const parts = formatter.formatToParts(date);

  const dateParts: { [key: string]: string } = {};
  parts.forEach((part) => {
    if (part.type !== "literal") {
      dateParts[part.type] = part.value;
    }
  });

  return {
    date: `${dateParts.year}-${dateParts.month}-${dateParts.day}`,
    time: `${dateParts.hour}:${dateParts.minute}:${dateParts.second}`,
    full: `${dateParts.year}-${dateParts.month}-${dateParts.day} ${dateParts.hour}:${dateParts.minute}:${dateParts.second}`,
  };
};

export const getRandomDarkHexColor = (): string => {
  const getDarkComponent = () =>
    Math.floor(Math.random() * 136)
      .toString(16)
      .padStart(2, "0");
  return `#${getDarkComponent()}${getDarkComponent()}${getDarkComponent()}`;
};

export function parseProductFilters<T>(
  query: QueryParams<T>,
): ProductFilters<T> {
  return {
    companyId: query.companyId ?? "",
    search: query.search ?? "",
    sortOrder:
      query.sortOrder === "asc" || query.sortOrder === "desc"
        ? query.sortOrder
        : undefined,
    sortField: query.sortField,
    page: query.page ?? "1",
    pageSize: query.pageSize ?? "10",
    categoryId: query.categoryId ?? "",
    trending: query.trending ?? "",
    minPrice: query.minPrice ?? "",
    maxPrice: query.maxPrice ?? "",
    availableOnly: query.availableOnly ?? "",
  };
}
