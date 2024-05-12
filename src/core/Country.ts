import getUnicodeFlagIcon from 'country-flag-icons/unicode';
export enum CountryCode {
  FRANCE = 'FR',
  USA = 'US',
  JAPAN = 'JP',
  CHINA = 'CN',
  GERMANY = 'DE',
  ITALY = 'IT',
  SPAIN = 'ES',
  UK = 'GB',
  CANADA = 'CA',
  BRAZIL = 'BR',
  AUSTRALIA = 'AU',
  INDIA = 'IN',
  RUSSIA = 'RU',
  SOUTH_KOREA = 'KR',
  MEXICO = 'MX',
  NETHERLANDS = 'NL',
  SWEDEN = 'SE',
  SWITZERLAND = 'CH',
  BELGIUM = 'BE',
  PORTUGAL = 'PT',
  ARGENTINA = 'AR',
  POLAND = 'PL',
  TURKEY = 'TR',
  AUSTRIA = 'AT',
  NORWAY = 'NO',
  DENMARK = 'DK',
  FINLAND = 'FI',
  IRELAND = 'IE',
  NEW_ZEALAND = 'NZ',
  GREECE = 'GR',
  HUNGARY = 'HU',
  CZECH_REPUBLIC = 'CZ',
  SLOVAKIA = 'SK',
}

export class Country {
  private readonly code: string;

  constructor(code: string | CountryCode) {
    this.code = code;
  }

  getCode() {
    return this.code;
  }

  getFlag() {
    return getUnicodeFlagIcon(this.code);
  }

  static getRandom() {
    const values = Object.values(CountryCode);
    const randomIndex = Math.floor(Math.random() * values.length);
    return new Country(values[randomIndex]);
  }
}
