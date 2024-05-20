import getUnicodeFlagIcon from 'country-flag-icons/unicode';
import { Image } from '@nextui-org/react';
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
  private static chromiumMethod: boolean | undefined = undefined;

  constructor(code: string | CountryCode) {
    this.code = code;
    if (Country.chromiumMethod === undefined) {
      Country.chromiumMethod = navigator.userAgent.toLowerCase().indexOf('firefox') <= -1;
      console.log('chromiumMethod', Country.chromiumMethod);
    }
  }

  getCode() {
    return this.code;
  }

  getFlag() {
    if (Country.chromiumMethod) {
      return (
        <Image
          src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${this.code}.svg`}
          alt={this.code}
          width={32}
          height={32}
        />
      );
    }
    return getUnicodeFlagIcon(this.code);
  }

  static getRandom() {
    const values = Object.values(CountryCode);
    const randomIndex = Math.floor(Math.random() * values.length);
    return new Country(values[randomIndex]);
  }
}
