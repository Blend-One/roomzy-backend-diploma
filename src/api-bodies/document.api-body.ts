import { ApiProperty } from '@nestjs/swagger';

export class DocumentDto {
    @ApiProperty({
        type: String,
        example: 'bd28877b-7b2a-4686-ac01-b3571fed3b6e',
        description: 'Id of the document',
    })
    id: string;

    @ApiProperty({
        type: String,
        example:
            '<?xml version="1.0" encoding="UTF-8"?>\n<rentalAgreement>\n  <agreementId>8520ca22-da0b-4bab-a4d5-99a21511d3b5</agreementId>\n  \n  <landlord>\n    <fullName>Ф.И.О</fullName>\n    <iin>801212350055</iin>\n  </landlord>\n\n  <tenant>\n    <fullName>Ф.И.О</fullName>\n    <iin>900101450044</iin>\n  </tenant>\n\n  <property>\n    <address>someStreet 12 54\n    <type>Квартира</type>\n    <area>60.5</area>\n  </property>\n\n  <terms>\n    <startDate>5/5/2025 6:14 PM</startDate>\n    <endDate>6/7/2025 6:14 PM</endDate>\n    <amount>868</amount>\n    <currency>KZT</currency>\n  </terms>\n\n<conditions>\n<securityDeposit>434</securityDeposit>    <utilitiesIncluded>false</utilitiesIncluded>\n    <sublettingAllowed>false</sublettingAllowed>\n  </conditions>\n\n  <createdAt>2025-05-04T13:30:00.239Z</createdAt>\n</rentalAgreement>',
        description: "Document's xml representation",
    })
    xml: string;

    @ApiProperty({
        type: String,
        example:
            'PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHJlbnRhbEFncmVlbWVudD4KICA8YWdyZWVtZW50SWQ+ODUyMGNhMjItZGEwYi00YmFiLWE0ZDUtOTlhMjE1MTFkM2I1PC9hZ3JlZW1lbnRJZD4KICAKICA8bGFuZGxvcmQ+CiAgICA8ZnVsbE5hbWU+0KQu0Jgu0J48L2Z1bGxOYW1lPgogICAgPGlpbj44MDEyMTIzNTAwNTU8L2lpbj4KICA8L2xhbmRsb3JkPgoKICA8dGVuYW50PgogICAgPGZ1bGxOYW1lPtCkLtCYLtCePC9mdWxsTmFtZT4KICAgIDxpaW4+OTAwMTAxNDUwMDQ0PC9paW4+CiAgPC90ZW5hbnQ+CgogIDxwcm9wZXJ0eT4KICAgIDxhZGRyZXNzPnNvbWVTdHJlZXQgMTIgNTQKICAgIDx0eXBlPtCa0LLQsNGA0YLQuNGA0LA8L3R5cGU',
        description: "Document's data in base64 representation",
    })
    base64Xml: string;

    @ApiProperty({
        type: String,
        example: 'CREATED',
        required: false,
        description: "Document's status",
    })
    status: string;

    @ApiProperty({
        type: String,
        example: '8520ca22-da0b-4bab-a4d5-99a21511d3b5',
        description: 'Id of the rent',
    })
    rentId: string;

    @ApiProperty({
        type: String,
        example: '2025-05-04T13:30:00.239Z',
        description: 'Date of the document creation',
    })
    createdDate: string;

    @ApiProperty({
        type: String,
        example: 'Doe John',
        description: 'Name of landlord which signed the document (nullable)',
    })
    landlordCommonName: string;

    @ApiProperty({
        type: String,
        example: '801212350055',
        description: 'Iin of landlord which signed the document (nullable)',
    })
    landlordIIN: string;

    @ApiProperty({
        type: String,
        example: 'John Doe',
        description: 'Name of renter which signed the document (nullable)',
    })
    renterCommonName: string;

    @ApiProperty({
        type: String,
        example: '900101450044',
        description: 'Iin of renter which signed the document (nullable)',
    })
    renterIIN: string;
}
