import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const splitSql = (sql: string) => {
  return sql.split(';').filter(content => content.trim() !== '')
}

async function main() {
  const sql = `

INSERT INTO "User" ("id", "email", "name", "pictureUrl", "tokenInvitation", "status", "globalRole", "password") VALUES ('84b145f4-b213-4281-99ab-87b07484ede1', '1Lorenzo_Mann@yahoo.com', 'Michael Brown', 'https://i.imgur.com/YfJQV5z.png?id=3', 'inv901234', 'VERIFIED', 'USER', '$2b$10$ppubsZypHzkqW9dkhMB97ul2.wSsvaCoDE2CzqIHygddRMKXvpYUC');
INSERT INTO "User" ("id", "email", "name", "pictureUrl", "tokenInvitation", "status", "globalRole", "password") VALUES ('dfa5dec6-6eeb-4312-8b6b-e580dee1bd70', '9Jamel.Schroeder@yahoo.com', 'John Doe', 'https://i.imgur.com/YfJQV5z.png?id=11', 'inv567890', 'VERIFIED', 'USER', '$2b$10$ppubsZypHzkqW9dkhMB97ul2.wSsvaCoDE2CzqIHygddRMKXvpYUC');
INSERT INTO "User" ("id", "email", "name", "pictureUrl", "tokenInvitation", "status", "globalRole", "password") VALUES ('5ca3feab-1fd5-472c-a6fe-61f3efcb204b', '17Aurore90@yahoo.com', 'Jane Smith', 'https://i.imgur.com/YfJQV5z.png?id=19', 'inv901234', 'VERIFIED', 'USER', '$2b$10$ppubsZypHzkqW9dkhMB97ul2.wSsvaCoDE2CzqIHygddRMKXvpYUC');
INSERT INTO "User" ("id", "email", "name", "pictureUrl", "tokenInvitation", "status", "globalRole", "password") VALUES ('a483ee44-116b-4a57-b139-b8393b72bd27', '33Thelma_Fay@yahoo.com', 'Emily Jones', 'https://i.imgur.com/YfJQV5z.png?id=35', 'inv567890', 'VERIFIED', 'USER', '$2b$10$ppubsZypHzkqW9dkhMB97ul2.wSsvaCoDE2CzqIHygddRMKXvpYUC');
INSERT INTO "User" ("id", "email", "name", "pictureUrl", "tokenInvitation", "status", "globalRole", "password") VALUES ('5b4a1f5f-695a-4d39-986b-9b7d5768ff6a', '41Grover52@hotmail.com', 'Michael Brown', 'https://i.imgur.com/YfJQV5z.png?id=43', 'inv789012', 'VERIFIED', 'USER', '$2b$10$ppubsZypHzkqW9dkhMB97ul2.wSsvaCoDE2CzqIHygddRMKXvpYUC');
INSERT INTO "User" ("id", "email", "name", "pictureUrl", "tokenInvitation", "status", "globalRole", "password") VALUES ('875c5bf9-38d9-4dde-84a7-123b0dfaf4ca', '49Ezequiel_Upton88@yahoo.com', 'John Doe', 'https://i.imgur.com/YfJQV5z.png?id=51', 'inv789012', 'VERIFIED', 'USER', '$2b$10$ppubsZypHzkqW9dkhMB97ul2.wSsvaCoDE2CzqIHygddRMKXvpYUC');
INSERT INTO "User" ("id", "email", "name", "pictureUrl", "tokenInvitation", "status", "globalRole", "password") VALUES ('d93609dd-1528-43a7-b75c-a83a5164684d', '57Avery_Romaguera@hotmail.com', 'Michael Brown', 'https://i.imgur.com/YfJQV5z.png?id=59', 'inv567890', 'VERIFIED', 'USER', '$2b$10$ppubsZypHzkqW9dkhMB97ul2.wSsvaCoDE2CzqIHygddRMKXvpYUC');
INSERT INTO "User" ("id", "email", "name", "pictureUrl", "tokenInvitation", "status", "globalRole", "password") VALUES ('ff854912-b19e-471c-8f22-c57087dfe9e0', '65Antone56@yahoo.com', 'David Wilson', 'https://i.imgur.com/YfJQV5z.png?id=67', 'inv345678', 'VERIFIED', 'USER', '$2b$10$ppubsZypHzkqW9dkhMB97ul2.wSsvaCoDE2CzqIHygddRMKXvpYUC');
INSERT INTO "User" ("id", "email", "name", "pictureUrl", "tokenInvitation", "status", "globalRole", "password") VALUES ('0431d984-aac0-4d82-adf2-30cc3fa4dad2', '73Rosario_Franey74@gmail.com', 'Michael Brown', 'https://i.imgur.com/YfJQV5z.png?id=75', 'inv901234', 'VERIFIED', 'USER', '$2b$10$ppubsZypHzkqW9dkhMB97ul2.wSsvaCoDE2CzqIHygddRMKXvpYUC');

INSERT INTO "Organization" ("id", "name", "pictureUrl") VALUES ('7781b995-1e6f-4c04-abc0-fa1685de85e2', 'Harrington  Co.', 'https://i.imgur.com/YfJQV5z.png?id=82');
INSERT INTO "Organization" ("id", "name", "pictureUrl") VALUES ('ef32c5b1-5c41-43ca-856d-41b139581c7e', 'Anderson  Associates', 'https://i.imgur.com/YfJQV5z.png?id=85');
INSERT INTO "Organization" ("id", "name", "pictureUrl") VALUES ('02fe3984-1e73-42f3-8238-16059e9d26a9', 'Smithson Law Group', 'https://i.imgur.com/YfJQV5z.png?id=88');
INSERT INTO "Organization" ("id", "name", "pictureUrl") VALUES ('bc517f00-62f0-4b67-8118-66802d8b47cc', 'Elite Legal Services', 'https://i.imgur.com/YfJQV5z.png?id=91');
INSERT INTO "Organization" ("id", "name", "pictureUrl") VALUES ('f52f6204-7c06-45c9-af96-7c5e465532d8', 'Smithson Law Group', 'https://i.imgur.com/YfJQV5z.png?id=94');
INSERT INTO "Organization" ("id", "name", "pictureUrl") VALUES ('4ca84424-5d69-4072-a2a4-c7c3e971412a', 'Smithson Law Group', 'https://i.imgur.com/YfJQV5z.png?id=97');
INSERT INTO "Organization" ("id", "name", "pictureUrl") VALUES ('e260d323-be7b-4f41-a8cb-0de5e5cc02c1', 'Anderson  Associates', 'https://i.imgur.com/YfJQV5z.png?id=100');
INSERT INTO "Organization" ("id", "name", "pictureUrl") VALUES ('d37f8f8c-a034-41ca-ba97-1e1b08621b64', 'Harrington  Co.', 'https://i.imgur.com/YfJQV5z.png?id=103');
INSERT INTO "Organization" ("id", "name", "pictureUrl") VALUES ('46824f94-1841-4e05-a6ef-fe9e5623f715', 'Elite Legal Services', 'https://i.imgur.com/YfJQV5z.png?id=106');
INSERT INTO "Organization" ("id", "name", "pictureUrl") VALUES ('fe86acf4-4a71-4537-97ac-d2dbf6ac3d4b', 'Smithson Law Group', 'https://i.imgur.com/YfJQV5z.png?id=109');

INSERT INTO "OrganizationRole" ("id", "name", "userId", "organizationId") VALUES ('ecdb736a-518c-4727-b327-432c0da072d4', 'Financial Administrator', 'ff854912-b19e-471c-8f22-c57087dfe9e0', 'e260d323-be7b-4f41-a8cb-0de5e5cc02c1');
INSERT INTO "OrganizationRole" ("id", "name", "userId", "organizationId") VALUES ('c77ce571-6722-41e3-a69d-4a83d7d8b9be', 'Super Administrator', 'dfa5dec6-6eeb-4312-8b6b-e580dee1bd70', 'bc517f00-62f0-4b67-8118-66802d8b47cc');
INSERT INTO "OrganizationRole" ("id", "name", "userId", "organizationId") VALUES ('5649b34c-ad43-4613-b32b-b73afaa566dd', 'Office Administrator', '21a857f1-ba5f-4435-bcf6-f910ec07c0dc', '4ca84424-5d69-4072-a2a4-c7c3e971412a');
INSERT INTO "OrganizationRole" ("id", "name", "userId", "organizationId") VALUES ('4dc5e5f2-92da-4f15-b3d2-5faa4b3633d7', 'Super Administrator', '21a857f1-ba5f-4435-bcf6-f910ec07c0dc', 'd37f8f8c-a034-41ca-ba97-1e1b08621b64');
INSERT INTO "OrganizationRole" ("id", "name", "userId", "organizationId") VALUES ('95e4330e-17fc-404f-a637-11c482b82d47', 'Practice Area Leader', '21a857f1-ba5f-4435-bcf6-f910ec07c0dc', '7781b995-1e6f-4c04-abc0-fa1685de85e2');
INSERT INTO "OrganizationRole" ("id", "name", "userId", "organizationId") VALUES ('ee724cf2-6275-452a-945d-02577ebbe8a6', 'Super Administrator', '0431d984-aac0-4d82-adf2-30cc3fa4dad2', 'f52f6204-7c06-45c9-af96-7c5e465532d8');
INSERT INTO "OrganizationRole" ("id", "name", "userId", "organizationId") VALUES ('de9f7c46-9599-4c19-a523-07419e7a04d6', 'Super Administrator', 'd93609dd-1528-43a7-b75c-a83a5164684d', 'bc517f00-62f0-4b67-8118-66802d8b47cc');
INSERT INTO "OrganizationRole" ("id", "name", "userId", "organizationId") VALUES ('081edf21-c60d-4e2d-a318-4b26327d44ac', 'Financial Administrator', 'd93609dd-1528-43a7-b75c-a83a5164684d', 'e260d323-be7b-4f41-a8cb-0de5e5cc02c1');
INSERT INTO "OrganizationRole" ("id", "name", "userId", "organizationId") VALUES ('0e9a302e-e233-4589-8388-8401876876a0', 'Senior Partner', 'a483ee44-116b-4a57-b139-b8393b72bd27', '02fe3984-1e73-42f3-8238-16059e9d26a9');
INSERT INTO "OrganizationRole" ("id", "name", "userId", "organizationId") VALUES ('68fc58a3-68d5-40d1-b8b2-e85a45f1b7db', 'Senior Partner', '5ca3feab-1fd5-472c-a6fe-61f3efcb204b', 'd37f8f8c-a034-41ca-ba97-1e1b08621b64');

INSERT INTO "PwaSubscription" ("id", "content", "userId") VALUES ('20a15d30-b4bb-40d5-a376-d759d287a097', 'System maintenance scheduled for this weekend.', 'ff854912-b19e-471c-8f22-c57087dfe9e0');
INSERT INTO "PwaSubscription" ("id", "content", "userId") VALUES ('f2211eab-c167-4dd9-b9c3-d2afeee683f7', 'Client feedback received please review.', 'a483ee44-116b-4a57-b139-b8393b72bd27');
INSERT INTO "PwaSubscription" ("id", "content", "userId") VALUES ('f9cad7d0-1708-4ae1-a66a-3f392492b803', 'Client feedback received please review.', 'dfa5dec6-6eeb-4312-8b6b-e580dee1bd70');
INSERT INTO "PwaSubscription" ("id", "content", "userId") VALUES ('aa2f8832-0818-44d5-900c-3868465b8650', 'Monthly billing report is ready for analysis.', '5ca3feab-1fd5-472c-a6fe-61f3efcb204b');
INSERT INTO "PwaSubscription" ("id", "content", "userId") VALUES ('723dac6c-5186-4f64-b652-f38d16cf2881', 'New case updates available for review.', '875c5bf9-38d9-4dde-84a7-123b0dfaf4ca');
INSERT INTO "PwaSubscription" ("id", "content", "userId") VALUES ('c9c10544-2158-4e72-b28f-a75179c46801', 'New case updates available for review.', 'dfa5dec6-6eeb-4312-8b6b-e580dee1bd70');
INSERT INTO "PwaSubscription" ("id", "content", "userId") VALUES ('c2704b8a-e756-4681-bf34-2bd29667c292', 'System maintenance scheduled for this weekend.', 'd93609dd-1528-43a7-b75c-a83a5164684d');
INSERT INTO "PwaSubscription" ("id", "content", "userId") VALUES ('971fa0ce-e2da-422e-9b48-9a37398e263c', 'Reminder Team meeting scheduled for tomorrow.', '21a857f1-ba5f-4435-bcf6-f910ec07c0dc');
INSERT INTO "PwaSubscription" ("id", "content", "userId") VALUES ('129903a4-e65e-49e7-b55e-7313aad8f2c6', 'Client feedback received please review.', '5b4a1f5f-695a-4d39-986b-9b7d5768ff6a');
INSERT INTO "PwaSubscription" ("id", "content", "userId") VALUES ('e4ae98fc-9ed3-41c5-a9b5-7245ede562a6', 'Client feedback received please review.', '5ca3feab-1fd5-472c-a6fe-61f3efcb204b');

INSERT INTO "RoleData" ("id", "name", "description") VALUES ('72e4222d-5401-4244-91a2-365d1891a82f', 'Senior Partner', 'Manages HR functions and monitors time and attendance.');
INSERT INTO "RoleData" ("id", "name", "description") VALUES ('df9d4af7-4410-4e6a-8227-c5f6e2d09c5f', 'Practice Area Leader', 'Access to client relationship management tools and oversight of junior attorneys.');
INSERT INTO "RoleData" ("id", "name", "description") VALUES ('70dcd259-974b-425c-8588-a6eb1c736c80', 'Senior Partner', 'Holds the highest level of system access and governance.');
INSERT INTO "RoleData" ("id", "name", "description") VALUES ('c55cb2c9-560c-49b7-aa93-6cf6a3027591', 'Practice Area Leader', 'Oversees billing expenses and compensation calculations.');
INSERT INTO "RoleData" ("id", "name", "description") VALUES ('903ec377-5fad-49ef-b5e9-5a818efc527a', 'Senior Partner', 'Manages HR functions and monitors time and attendance.');
INSERT INTO "RoleData" ("id", "name", "description") VALUES ('2b36e96a-9d2a-45d2-933a-6b273bdd142b', 'Practice Area Leader', 'Oversees billing expenses and compensation calculations.');
INSERT INTO "RoleData" ("id", "name", "description") VALUES ('6dcb7230-4762-498b-a4ba-214789ec2ade', 'Super Administrator', 'Focuses on departmentspecific tasks and resource allocation.');
INSERT INTO "RoleData" ("id", "name", "description") VALUES ('e2feda57-4230-4209-9f46-a181a12c2790', 'Senior Partner', 'Holds the highest level of system access and governance.');
INSERT INTO "RoleData" ("id", "name", "description") VALUES ('affda2d1-828f-4611-9e80-0d41c8d36979', 'Super Administrator', 'Manages HR functions and monitors time and attendance.');
INSERT INTO "RoleData" ("id", "name", "description") VALUES ('a9dd280d-8d8b-430f-b191-681084320ead', 'Senior Partner', 'Access to client relationship management tools and oversight of junior attorneys.');

INSERT INTO "UserRole" ("userId", "roleId", "id") VALUES ('5ca3feab-1fd5-472c-a6fe-61f3efcb204b', 'e2feda57-4230-4209-9f46-a181a12c2790', 'd7e9daef-5ac7-46ec-aafb-d615ad06ca7b');
INSERT INTO "UserRole" ("userId", "roleId", "id") VALUES ('21a857f1-ba5f-4435-bcf6-f910ec07c0dc', 'a9dd280d-8d8b-430f-b191-681084320ead', '0bc08ade-f25f-4114-94e8-3c1b36ac6daf');
INSERT INTO "UserRole" ("userId", "roleId", "id") VALUES ('0431d984-aac0-4d82-adf2-30cc3fa4dad2', 'e2feda57-4230-4209-9f46-a181a12c2790', '3e9f77f9-36f2-48ac-8bfa-a206402e4c96');
INSERT INTO "UserRole" ("userId", "roleId", "id") VALUES ('0431d984-aac0-4d82-adf2-30cc3fa4dad2', 'df9d4af7-4410-4e6a-8227-c5f6e2d09c5f', '0d1daca4-7cd1-4ea0-864d-6e0470e39b16');
INSERT INTO "UserRole" ("userId", "roleId", "id") VALUES ('a483ee44-116b-4a57-b139-b8393b72bd27', 'c55cb2c9-560c-49b7-aa93-6cf6a3027591', '1c638a6a-acb8-4864-951c-5a6510e1795b');
INSERT INTO "UserRole" ("userId", "roleId", "id") VALUES ('21a857f1-ba5f-4435-bcf6-f910ec07c0dc', '903ec377-5fad-49ef-b5e9-5a818efc527a', 'b09a26e2-a9ab-4900-9365-9d138a259fbe');
INSERT INTO "UserRole" ("userId", "roleId", "id") VALUES ('5b4a1f5f-695a-4d39-986b-9b7d5768ff6a', '72e4222d-5401-4244-91a2-365d1891a82f', '5e80e8f2-15cd-4771-b81c-f22821738b51');
INSERT INTO "UserRole" ("userId", "roleId", "id") VALUES ('ff854912-b19e-471c-8f22-c57087dfe9e0', '2b36e96a-9d2a-45d2-933a-6b273bdd142b', 'f5106e3d-b5b2-4d02-b6ea-3d4c2835854f');
INSERT INTO "UserRole" ("userId", "roleId", "id") VALUES ('5ca3feab-1fd5-472c-a6fe-61f3efcb204b', 'e2feda57-4230-4209-9f46-a181a12c2790', 'fe7e757e-e142-4eaf-bd6c-a34ea7b61005');
INSERT INTO "UserRole" ("userId", "roleId", "id") VALUES ('0431d984-aac0-4d82-adf2-30cc3fa4dad2', 'affda2d1-828f-4611-9e80-0d41c8d36979', 'f6cdd078-a25a-4255-896f-d21ebc3df838');

INSERT INTO "Client" ("id", "name", "email", "phone", "address", "organizationId") VALUES ('951261ed-7a16-4c4f-bb48-3c949cdcdead', 'Robert Brown', '192Leonie.Lockman@hotmail.com', '1212345678', '194 18 W 29th St, New York, NY 10001', 'f52f6204-7c06-45c9-af96-7c5e465532d8');
INSERT INTO "Client" ("id", "name", "email", "phone", "address", "organizationId") VALUES ('f87ab341-048b-42ef-a117-b44e34e50885', 'John Doe', '197Lenna.Streich3@gmail.com', '1098765432', '199 18 Spring St, New York, NY 10012', '46824f94-1841-4e05-a6ef-fe9e5623f715');
INSERT INTO "Client" ("id", "name", "email", "phone", "address", "organizationId") VALUES ('7ae1beb2-298a-499a-96ce-518cc5c85866', 'John Doe', '202Nikolas91@yahoo.com', '1123456789', '204 443 E 6th St, New York, NY 10009', 'bc517f00-62f0-4b67-8118-66802d8b47cc');
INSERT INTO "Client" ("id", "name", "email", "phone", "address", "organizationId") VALUES ('123c6fcf-a451-46f0-bd8a-bdf33351110f', 'Emily Davis', '207Velva.Wisoky88@gmail.com', '1987654321', '209 430 Lafayette St, New York, NY 10003', 'fe86acf4-4a71-4537-97ac-d2dbf6ac3d4b');
INSERT INTO "Client" ("id", "name", "email", "phone", "address", "organizationId") VALUES ('fa41632a-443a-4716-b2c6-c3e93c22fa44', 'Emily Davis', '212Cornell.Wunsch@gmail.com', '1212345678', '214 136 E 13th St, New York, NY 10003', '46824f94-1841-4e05-a6ef-fe9e5623f715');
INSERT INTO "Client" ("id", "name", "email", "phone", "address", "organizationId") VALUES ('587eb063-b922-4b0d-9082-f0e56f6a1ca9', 'Emily Davis', '217Julio.Mosciski69@hotmail.com', '1098765432', '219 136 E 13th St, New York, NY 10003', '4ca84424-5d69-4072-a2a4-c7c3e971412a');
INSERT INTO "Client" ("id", "name", "email", "phone", "address", "organizationId") VALUES ('12903fd9-dafe-45bf-be96-af43515fe361', 'Emily Davis', '222Justyn.Dickinson-Crist@yahoo.com', '1212345678', '224 42 E 20th St, New York, NY 10003', 'd37f8f8c-a034-41ca-ba97-1e1b08621b64');
INSERT INTO "Client" ("id", "name", "email", "phone", "address", "organizationId") VALUES ('ef7d9632-2daa-4458-ae3a-7ddc1565b21c', 'John Doe', '227Ignatius_Tremblay@yahoo.com', '1987654321', '229 91 Christopher St, New York, NY 10014', '46824f94-1841-4e05-a6ef-fe9e5623f715');
INSERT INTO "Client" ("id", "name", "email", "phone", "address", "organizationId") VALUES ('ed5a4e1e-1ed1-45bd-b7d1-465c1f9cf17d', 'Emily Davis', '232Blair_Miller95@yahoo.com', '1123456789', '234 91 Christopher St, New York, NY 10014', '4ca84424-5d69-4072-a2a4-c7c3e971412a');
INSERT INTO "Client" ("id", "name", "email", "phone", "address", "organizationId") VALUES ('cfef38d2-ba5c-4029-818f-33ba89ff0851', 'Emily Davis', '237Gertrude90@yahoo.com', '1123456789', '239 330 W Broadway, New York, NY 10013', 'e260d323-be7b-4f41-a8cb-0de5e5cc02c1');

INSERT INTO "Matter" ("id", "title", "description", "status", "clientId", "organizationId") VALUES ('254e78b9-5a11-4d6f-b781-35e5f634fb91', 'Personal Injury Claim', 'Negotiation and drafting of lease agreements.', 'In Progress', 'ed5a4e1e-1ed1-45bd-b7d1-465c1f9cf17d', 'ef32c5b1-5c41-43ca-856d-41b139581c7e');
INSERT INTO "Matter" ("id", "title", "description", "status", "clientId", "organizationId") VALUES ('c2b890cd-d9b7-4e3e-bbec-775c660570f4', 'Personal Injury Claim', 'Negotiation and drafting of lease agreements.', 'In Progress', '951261ed-7a16-4c4f-bb48-3c949cdcdead', '46824f94-1841-4e05-a6ef-fe9e5623f715');
INSERT INTO "Matter" ("id", "title", "description", "status", "clientId", "organizationId") VALUES ('c9370662-ec6d-47cc-bf96-76078e5640de', 'Patent Infringement Dispute', 'Legal advice on compliance with new regulations.', 'In Progress', '951261ed-7a16-4c4f-bb48-3c949cdcdead', '4ca84424-5d69-4072-a2a4-c7c3e971412a');
INSERT INTO "Matter" ("id", "title", "description", "status", "clientId", "organizationId") VALUES ('10fb6201-b6ea-4a35-8680-9232b9bf6083', 'Breach of Contract Case', 'Client seeks compensation for damages incurred.', 'Awaiting Client Approval', 'ed5a4e1e-1ed1-45bd-b7d1-465c1f9cf17d', '46824f94-1841-4e05-a6ef-fe9e5623f715');
INSERT INTO "Matter" ("id", "title", "description", "status", "clientId", "organizationId") VALUES ('1ff7ec06-a363-4e0f-bb70-0cb53b9a989f', 'Employment Law Consultation', 'Legal advice on compliance with new regulations.', 'Open', '7ae1beb2-298a-499a-96ce-518cc5c85866', '46824f94-1841-4e05-a6ef-fe9e5623f715');
INSERT INTO "Matter" ("id", "title", "description", "status", "clientId", "organizationId") VALUES ('90c782fd-de47-40d0-9dab-7460e2028ea7', 'Real Estate Transaction', 'Legal advice on compliance with new regulations.', 'In Progress', '587eb063-b922-4b0d-9082-f0e56f6a1ca9', 'fe86acf4-4a71-4537-97ac-d2dbf6ac3d4b');
INSERT INTO "Matter" ("id", "title", "description", "status", "clientId", "organizationId") VALUES ('6e584342-948e-4fa4-9f3e-34c1023db2a8', 'Employment Law Consultation', 'Negotiation and drafting of lease agreements.', 'Closed', 'cfef38d2-ba5c-4029-818f-33ba89ff0851', '46824f94-1841-4e05-a6ef-fe9e5623f715');
INSERT INTO "Matter" ("id", "title", "description", "status", "clientId", "organizationId") VALUES ('4b9c3c1d-8cb9-45a8-9fbf-962eceb3329c', 'Real Estate Transaction', 'Client seeks compensation for damages incurred.', 'Pending Review', '7ae1beb2-298a-499a-96ce-518cc5c85866', '7781b995-1e6f-4c04-abc0-fa1685de85e2');
INSERT INTO "Matter" ("id", "title", "description", "status", "clientId", "organizationId") VALUES ('d6792d02-c920-4e22-ad6b-f83b86527d5e', 'Patent Infringement Dispute', 'Legal advice on compliance with new regulations.', 'Open', '587eb063-b922-4b0d-9082-f0e56f6a1ca9', '4ca84424-5d69-4072-a2a4-c7c3e971412a');
INSERT INTO "Matter" ("id", "title", "description", "status", "clientId", "organizationId") VALUES ('ab27fe51-66ac-4779-99d2-d728d5c1e97e', 'Patent Infringement Dispute', 'Representation in a highstakes litigation matter.', 'Pending Review', 'cfef38d2-ba5c-4029-818f-33ba89ff0851', 'f52f6204-7c06-45c9-af96-7c5e465532d8');

INSERT INTO "Task" ("id", "title", "description", "status", "dueDate", "assignedUserId", "matterId") VALUES ('c3858521-df2a-41d2-8af5-086c64b9baef', 'Conduct Legal Research', 'Drafting the initial complaint for the upcoming case.', 'On Hold', '2025-09-14T18:54:20.419Z', '21a857f1-ba5f-4435-bcf6-f910ec07c0dc', '6e584342-948e-4fa4-9f3e-34c1023db2a8');
INSERT INTO "Task" ("id", "title", "description", "status", "dueDate", "assignedUserId", "matterId") VALUES ('795a5218-cd1c-4831-9fd8-bff1d5bf0ab5', 'Review Contract Terms', 'Organizing a meeting with the client to discuss case progress.', 'Pending Review', '2023-11-22T09:34:36.058Z', '21a857f1-ba5f-4435-bcf6-f910ec07c0dc', '10fb6201-b6ea-4a35-8680-9232b9bf6083');
INSERT INTO "Task" ("id", "title", "description", "status", "dueDate", "assignedUserId", "matterId") VALUES ('71d64107-20e5-4673-ac99-0e14ce7bb379', 'Prepare Witness Statements', 'Reviewing the terms of the new client contract.', 'Completed', '2023-12-19T10:30:44.205Z', 'a483ee44-116b-4a57-b139-b8393b72bd27', '6e584342-948e-4fa4-9f3e-34c1023db2a8');
INSERT INTO "Task" ("id", "title", "description", "status", "dueDate", "assignedUserId", "matterId") VALUES ('91873442-a484-4d69-81a1-0e91bf70a7e4', 'Conduct Legal Research', 'Researching relevant case law and statutes.', 'Not Started', '2025-07-27T22:12:09.359Z', 'd93609dd-1528-43a7-b75c-a83a5164684d', 'ab27fe51-66ac-4779-99d2-d728d5c1e97e');
INSERT INTO "Task" ("id", "title", "description", "status", "dueDate", "assignedUserId", "matterId") VALUES ('6779b262-2b42-4874-be65-c86fd7911fd6', 'Conduct Legal Research', 'Organizing a meeting with the client to discuss case progress.', 'Not Started', '2024-03-17T17:20:16.097Z', '0431d984-aac0-4d82-adf2-30cc3fa4dad2', '6e584342-948e-4fa4-9f3e-34c1023db2a8');
INSERT INTO "Task" ("id", "title", "description", "status", "dueDate", "assignedUserId", "matterId") VALUES ('84c10516-16dc-4a89-a764-2008ac25e6ed', 'Draft Initial Complaint', 'Researching relevant case law and statutes.', 'On Hold', '2025-02-19T03:17:19.589Z', 'd93609dd-1528-43a7-b75c-a83a5164684d', '1ff7ec06-a363-4e0f-bb70-0cb53b9a989f');
INSERT INTO "Task" ("id", "title", "description", "status", "dueDate", "assignedUserId", "matterId") VALUES ('82160673-55a3-4336-828b-4121acccbb61', 'Prepare Witness Statements', 'Researching relevant case law and statutes.', 'Not Started', '2023-12-23T05:46:38.183Z', '84b145f4-b213-4281-99ab-87b07484ede1', '6e584342-948e-4fa4-9f3e-34c1023db2a8');
INSERT INTO "Task" ("id", "title", "description", "status", "dueDate", "assignedUserId", "matterId") VALUES ('639f879c-15bb-4fc9-9c37-7cdad3097b13', 'Conduct Legal Research', 'Organizing a meeting with the client to discuss case progress.', 'In Progress', '2025-07-31T06:27:13.817Z', '5ca3feab-1fd5-472c-a6fe-61f3efcb204b', 'd6792d02-c920-4e22-ad6b-f83b86527d5e');
INSERT INTO "Task" ("id", "title", "description", "status", "dueDate", "assignedUserId", "matterId") VALUES ('bd360c81-4d9e-41c0-bcf7-c832f251ed7d', 'Draft Initial Complaint', 'Preparing statements for key witnesses.', 'Pending Review', '2025-04-15T17:01:23.401Z', '21a857f1-ba5f-4435-bcf6-f910ec07c0dc', '10fb6201-b6ea-4a35-8680-9232b9bf6083');
INSERT INTO "Task" ("id", "title", "description", "status", "dueDate", "assignedUserId", "matterId") VALUES ('9aa774be-caec-4086-9dc4-a8cebf2a8a20', 'Schedule Client Meeting', 'Preparing statements for key witnesses.', 'On Hold', '2024-08-13T04:26:43.274Z', '875c5bf9-38d9-4dde-84a7-123b0dfaf4ca', '1ff7ec06-a363-4e0f-bb70-0cb53b9a989f');

INSERT INTO "TimeEntry" ("id", "description", "startTime", "endTime", "duration", "userId", "taskId", "matterId") VALUES ('96859667-7af6-4439-8e29-ed7b3ce26f13', 'Research on recent case law', '2024-07-19T14:51:33.323Z', '2023-11-11T08:32:06.004Z', '45m', '875c5bf9-38d9-4dde-84a7-123b0dfaf4ca', 'c3858521-df2a-41d2-8af5-086c64b9baef', 'ab27fe51-66ac-4779-99d2-d728d5c1e97e');
INSERT INTO "TimeEntry" ("id", "description", "startTime", "endTime", "duration", "userId", "taskId", "matterId") VALUES ('4bc9a711-be40-438c-9f68-80f2c69251fd', 'Internal team meeting', '2025-07-19T15:14:50.713Z', '2025-06-07T19:39:53.957Z', '1h', '0431d984-aac0-4d82-adf2-30cc3fa4dad2', '84c10516-16dc-4a89-a764-2008ac25e6ed', '4b9c3c1d-8cb9-45a8-9fbf-962eceb3329c');
INSERT INTO "TimeEntry" ("id", "description", "startTime", "endTime", "duration", "userId", "taskId", "matterId") VALUES ('9a9d3fbb-3a8f-413e-9ce2-511f0faaed66', 'Preparing for court appearance', '2024-09-12T00:17:53.433Z', '2024-01-23T21:30:03.141Z', '2h', '5b4a1f5f-695a-4d39-986b-9b7d5768ff6a', '91873442-a484-4d69-81a1-0e91bf70a7e4', 'ab27fe51-66ac-4779-99d2-d728d5c1e97e');
INSERT INTO "TimeEntry" ("id", "description", "startTime", "endTime", "duration", "userId", "taskId", "matterId") VALUES ('e1071af7-7962-48e5-b967-debc6a36ff34', 'Internal team meeting', '2024-02-29T19:55:52.357Z', '2025-01-13T09:11:51.613Z', '1h', '0431d984-aac0-4d82-adf2-30cc3fa4dad2', '91873442-a484-4d69-81a1-0e91bf70a7e4', 'c9370662-ec6d-47cc-bf96-76078e5640de');
INSERT INTO "TimeEntry" ("id", "description", "startTime", "endTime", "duration", "userId", "taskId", "matterId") VALUES ('2348aafd-da13-4d86-8b20-e8f57f221a34', 'Drafting initial client agreement', '2024-06-12T22:22:24.092Z', '2024-10-11T06:35:51.397Z', '45m', '875c5bf9-38d9-4dde-84a7-123b0dfaf4ca', '71d64107-20e5-4673-ac99-0e14ce7bb379', '10fb6201-b6ea-4a35-8680-9232b9bf6083');
INSERT INTO "TimeEntry" ("id", "description", "startTime", "endTime", "duration", "userId", "taskId", "matterId") VALUES ('169f8459-f936-4332-931c-e4770c7de621', 'Drafting initial client agreement', '2025-01-06T05:09:00.989Z', '2023-12-09T16:24:33.911Z', '2h', '5ca3feab-1fd5-472c-a6fe-61f3efcb204b', 'bd360c81-4d9e-41c0-bcf7-c832f251ed7d', '6e584342-948e-4fa4-9f3e-34c1023db2a8');
INSERT INTO "TimeEntry" ("id", "description", "startTime", "endTime", "duration", "userId", "taskId", "matterId") VALUES ('f9bdc8bf-e0cd-4fe7-bf23-d6ee6c690f9c', 'Drafting initial client agreement', '2023-10-31T14:23:36.008Z', '2024-01-01T11:36:31.664Z', '1h', '5ca3feab-1fd5-472c-a6fe-61f3efcb204b', '6779b262-2b42-4874-be65-c86fd7911fd6', '90c782fd-de47-40d0-9dab-7460e2028ea7');
INSERT INTO "TimeEntry" ("id", "description", "startTime", "endTime", "duration", "userId", "taskId", "matterId") VALUES ('2674b896-a434-4e92-9abd-6ddb8782fdef', 'Internal team meeting', '2024-05-22T04:44:50.574Z', '2024-02-05T17:45:21.374Z', '1h', '84b145f4-b213-4281-99ab-87b07484ede1', 'c3858521-df2a-41d2-8af5-086c64b9baef', 'ab27fe51-66ac-4779-99d2-d728d5c1e97e');
INSERT INTO "TimeEntry" ("id", "description", "startTime", "endTime", "duration", "userId", "taskId", "matterId") VALUES ('ec31cb3b-c0c0-4c22-ad2c-ef04719818e8', 'Reviewing client documents', '2025-07-13T02:18:55.647Z', '2024-12-20T15:51:59.999Z', '2h', '5ca3feab-1fd5-472c-a6fe-61f3efcb204b', '71d64107-20e5-4673-ac99-0e14ce7bb379', '4b9c3c1d-8cb9-45a8-9fbf-962eceb3329c');
INSERT INTO "TimeEntry" ("id", "description", "startTime", "endTime", "duration", "userId", "taskId", "matterId") VALUES ('195629e2-0207-4a72-a83f-f8b80e680a5d', 'Drafting initial client agreement', '2023-11-06T17:45:27.729Z', '2024-09-30T03:14:07.815Z', '3h 15m', '0431d984-aac0-4d82-adf2-30cc3fa4dad2', '82160673-55a3-4336-828b-4121acccbb61', '6e584342-948e-4fa4-9f3e-34c1023db2a8');

INSERT INTO "Expense" ("id", "description", "amount", "date", "receiptUrl", "userId", "matterId") VALUES ('fa781692-e380-44fc-8468-5035e5499032', 'Software subscription renewal', '99.99', '2025-02-26T09:16:17.824Z', 'https://i.imgur.com/YfJQV5z.png?id=384', '0431d984-aac0-4d82-adf2-30cc3fa4dad2', 'ab27fe51-66ac-4779-99d2-d728d5c1e97e');
INSERT INTO "Expense" ("id", "description", "amount", "date", "receiptUrl", "userId", "matterId") VALUES ('14b6f6b9-fbd1-47f8-9804-76740b2586ac', 'Client lunch meeting', '150.00', '2024-07-31T13:27:12.133Z', 'https://i.imgur.com/YfJQV5z.png?id=389', '84b145f4-b213-4281-99ab-87b07484ede1', 'c2b890cd-d9b7-4e3e-bbec-775c660570f4');
INSERT INTO "Expense" ("id", "description", "amount", "date", "receiptUrl", "userId", "matterId") VALUES ('bc0303f4-184d-47bc-ae2e-e0bc8df7450a', 'Court filing fee', '99.99', '2024-10-22T13:52:09.601Z', 'https://i.imgur.com/YfJQV5z.png?id=394', '84b145f4-b213-4281-99ab-87b07484ede1', '1ff7ec06-a363-4e0f-bb70-0cb53b9a989f');
INSERT INTO "Expense" ("id", "description", "amount", "date", "receiptUrl", "userId", "matterId") VALUES ('5d18e6c5-b26f-4355-8960-362506c70a9c', 'Software subscription renewal', '75.50', '2024-02-16T15:57:34.568Z', 'https://i.imgur.com/YfJQV5z.png?id=399', '21a857f1-ba5f-4435-bcf6-f910ec07c0dc', 'c2b890cd-d9b7-4e3e-bbec-775c660570f4');
INSERT INTO "Expense" ("id", "description", "amount", "date", "receiptUrl", "userId", "matterId") VALUES ('35a56a01-a267-4b38-a1a6-5970f93ae33a', 'Client lunch meeting', '450.75', '2025-02-02T11:33:50.968Z', 'https://i.imgur.com/YfJQV5z.png?id=404', '21a857f1-ba5f-4435-bcf6-f910ec07c0dc', '90c782fd-de47-40d0-9dab-7460e2028ea7');
INSERT INTO "Expense" ("id", "description", "amount", "date", "receiptUrl", "userId", "matterId") VALUES ('72995e6f-c680-4bfe-a9f9-ff759fd5b17d', 'Client lunch meeting', '150.00', '2025-01-11T09:26:31.027Z', 'https://i.imgur.com/YfJQV5z.png?id=409', '5b4a1f5f-695a-4d39-986b-9b7d5768ff6a', '90c782fd-de47-40d0-9dab-7460e2028ea7');
INSERT INTO "Expense" ("id", "description", "amount", "date", "receiptUrl", "userId", "matterId") VALUES ('55de1af3-e32d-4f0c-87ed-c27f3fb35c7d', 'Software subscription renewal', '300.00', '2024-11-05T02:16:05.990Z', 'https://i.imgur.com/YfJQV5z.png?id=414', '0431d984-aac0-4d82-adf2-30cc3fa4dad2', '90c782fd-de47-40d0-9dab-7460e2028ea7');
INSERT INTO "Expense" ("id", "description", "amount", "date", "receiptUrl", "userId", "matterId") VALUES ('81d69651-16bf-4e07-a27f-e73491a2071f', 'Travel expenses for conference', '150.00', '2025-05-04T00:16:25.744Z', 'https://i.imgur.com/YfJQV5z.png?id=419', 'd93609dd-1528-43a7-b75c-a83a5164684d', 'c2b890cd-d9b7-4e3e-bbec-775c660570f4');
INSERT INTO "Expense" ("id", "description", "amount", "date", "receiptUrl", "userId", "matterId") VALUES ('54563933-516d-4b30-9d4e-c2a29dd7a3fa', 'Software subscription renewal', '300.00', '2024-08-02T15:13:00.432Z', 'https://i.imgur.com/YfJQV5z.png?id=424', '5b4a1f5f-695a-4d39-986b-9b7d5768ff6a', 'ab27fe51-66ac-4779-99d2-d728d5c1e97e');
INSERT INTO "Expense" ("id", "description", "amount", "date", "receiptUrl", "userId", "matterId") VALUES ('616fc897-0b32-4522-b449-7bc8b2aa7988', 'Client lunch meeting', '99.99', '2025-04-16T08:03:35.054Z', 'https://i.imgur.com/YfJQV5z.png?id=429', 'ff854912-b19e-471c-8f22-c57087dfe9e0', '1ff7ec06-a363-4e0f-bb70-0cb53b9a989f');

  `

  const sqls = splitSql(sql)

  for (const sql of sqls) {
    try {
      await prisma.$executeRawUnsafe(`${sql}`)
    } catch (error) {
      console.log(`Could not insert SQL: ${error.message}`)
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async error => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
