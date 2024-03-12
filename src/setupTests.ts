import { mockEmailTemplates } from './common/constants/mocks/mockEmailTemplates';
import { mockEmailTemplateTags } from './common/constants/mocks/mockEmailTemplateTags';
import { mockExperiments } from './common/constants/mocks/mockExperiments';
import { mockExperimentTagRelationships } from './common/constants/mocks/mockExperimentTagRelationships';
import { mockExperimentTags } from './common/constants/mocks/mockExperimentTags';
import { mockHypotheses } from './common/constants/mocks/mockHypotheses';
import { mockMessageTags } from './common/constants/mocks/mockMessageTags';
import { mockPermissions } from './common/constants/mocks/mockPermissions';
import { mockPimVerify } from './common/constants/mocks/mockPimVerify';
import { mockRolePermissions } from './common/constants/mocks/mockRolePermissions';
import { mockRoles } from './common/constants/mocks/mockRoles';
import { mockUserRoles } from './common/constants/mocks/mockUserRoles';
import { mockUsers } from './common/constants/mocks/mockUsers';
import { HttpStatusCode as mockHttpStatusCode } from './common/enums/HttpStatusCode';
import type { EmailTemplateUI } from './common/interfaces/emailTemplate/EmailTemplateUI';
import type { EmailTemplateTagUI } from './common/interfaces/emailTemplateTag/EmailTemplateTagUI';
import type { ExperimentUI } from './common/interfaces/experiment/ExperimentUI';
import type { ExperimentTagUI } from './common/interfaces/experimentTag/ExperimentTagUI';
import type { ExperimentTagRelationshipUI } from './common/interfaces/experimentTagRelationship/ExperimentTagRelationshipUI';
import type { HypothesisUI } from './common/interfaces/hypothesis/HypothesisUI';
import type { MessageTagUI } from './common/interfaces/messageTag/MessageTagUI';
import type { PatchUI } from './common/interfaces/patch/PatchUI';
import type { RoleUI } from './common/interfaces/role/RoleUI';
import type { UserUI } from './common/interfaces/user/UserUI';

jest.mock('./common/constants/authorization/msalInstance', () => ({
   getActiveAccount: () => ({}),
   acquireTokenSilent: async () => Promise.resolve({ accessToken: '' }),
}));

jest.mock('./common/hooks/endpoints/useEmailTemplateEndpoint', () => ({
   delete: async (_id: number) => Promise.resolve({ status: mockHttpStatusCode.OK }),
   get: async () => Promise.resolve({
      data: mockEmailTemplates.get,
      status: mockHttpStatusCode.OK,
   }),
   post: async (
      _experimentId: number,
      _subject: string,
      _message: string,
      _htmlMessage: string,
      _sendOn: string | null,
      _weight: number,
   ) => Promise.resolve({
      data: 'id: 999',
      status: mockHttpStatusCode.created,
   }),
   put: async (_emailTemplate: EmailTemplateUI) => Promise.resolve({ status: mockHttpStatusCode.OK }),
}));

jest.mock('./common/hooks/endpoints/useEmailTemplateTagEndpoint', () => ({
   delete: async (_id: number) => Promise.resolve({ status: mockHttpStatusCode.OK }),
   get: async () => Promise.resolve({
      data: mockEmailTemplateTags.get,
      status: mockHttpStatusCode.OK,
   }),
   post: async (_emailTemplateId: number, _messageTagId: number) => Promise.resolve({
      data: 'id: 999',
      status: mockHttpStatusCode.created,
   }),
   put: async (_emailTemplateTag: EmailTemplateTagUI) => Promise.resolve({ status: mockHttpStatusCode.OK }),
}));

jest.mock('./common/hooks/endpoints/useExperimentEndpoint', () => ({
   delete: async (_id: number) => Promise.resolve({ status: mockHttpStatusCode.OK }),
   get: async () => Promise.resolve({
      data: mockExperiments.get,
      status: mockHttpStatusCode.OK,
   }),
   post: async (_name: string, _description: string, _beginOn: string, _endOn: string) => Promise.resolve({
      data: 'id: 999',
      status: mockHttpStatusCode.OK,
   }),
   put: async (_experiment: ExperimentUI) => Promise.resolve({ status: mockHttpStatusCode.OK }),
}));

jest.mock('./common/hooks/endpoints/useExperimentTagEndpoint', () => ({
   delete: async (_id: number) => Promise.resolve({ status: mockHttpStatusCode.OK }),
   get: async () => Promise.resolve({
      data: mockExperimentTags.get,
      status: mockHttpStatusCode.OK,
   }),
   post: async (_name: string, _description: string) => Promise.resolve({
      data: 'id: 999',
      status: mockHttpStatusCode.created,
   }),
   put: async (_experimentTag: ExperimentTagUI) => Promise.resolve({ status: mockHttpStatusCode.OK }),
}));

jest.mock('./common/hooks/endpoints/useExperimentTagRelationshipEndpoint', () => ({
   delete: async (_id: number) => Promise.resolve({ status: mockHttpStatusCode.OK }),
   get: async () => Promise.resolve({
      data: mockExperimentTagRelationships.get,
      status: mockHttpStatusCode.OK,
   }),
   post: async (_experimentId: number, _experimentTagId: number) => Promise.resolve({
      data: 'id: 999',
      status: mockHttpStatusCode.created,
   }),
   put: async (_experimentTagRelationship: ExperimentTagRelationshipUI) => Promise.resolve({ status: mockHttpStatusCode.OK }),
}));

jest.mock('./common/hooks/endpoints/useHypothesisEndpoint', () => ({
   delete: async (_id: number) => Promise.resolve({ status: mockHttpStatusCode.OK }),
   get: async () => Promise.resolve({
      data: mockHypotheses.get,
      status: mockHttpStatusCode.OK,
   }),
   post: async (_experimentId: number, _hypothesis: string) => Promise.resolve({
      data: 'id: 999',
      status: mockHttpStatusCode.OK,
   }),
   put: async (_hypothesis: HypothesisUI) => Promise.resolve({ status: mockHttpStatusCode.OK }),
}));

jest.mock('./common/hooks/endpoints/useMessageTagEndpoint', () => ({
   delete: async (_id: number) => Promise.resolve({ status: mockHttpStatusCode.OK }),
   get: async () => Promise.resolve({
      data: mockMessageTags.get,
      status: mockHttpStatusCode.OK,
   }),
   post: async (_name: string, _description: string) => Promise.resolve({
      data: 'id: 999',
      status: mockHttpStatusCode.created,
   }),
   put: async (_messageTag: MessageTagUI) => Promise.resolve({ status: mockHttpStatusCode.OK }),
}));

jest.mock('./common/hooks/endpoints/usePermissionEndpoint', () => ({
   delete: async (_id: number) => Promise.resolve({ status: mockHttpStatusCode.OK }),
   get: async () => Promise.resolve({
      data: mockPermissions.get,
      status: mockHttpStatusCode.OK,
   }),
   post: async (_name: string, _description: string) => Promise.resolve({
      data: 'id: 999',
      status: mockHttpStatusCode.created,
   }),
}));

jest.mock('./common/hooks/endpoints/usePermissionEntityEndpoint', () => ({
   patch: async (_id: number, _updates: PatchUI[]) => Promise.resolve({ status: mockHttpStatusCode.OK }),
}));

jest.mock('./common/hooks/endpoints/usePimVerifyEndpoint', () => ({
   post: async (_ssoObjectId: string) => Promise.resolve({
      data: mockPimVerify.post,
      status: mockHttpStatusCode.OK,
   }),
}));

jest.mock('./common/hooks/endpoints/useRoleEndpoint', () => ({
   delete: async (_id: number) => Promise.resolve({ status: mockHttpStatusCode.OK }),
   get: async () => Promise.resolve({
      data: mockRoles.get,
      status: mockHttpStatusCode.OK,
   }),
   post: async (_roleName: string, _roleDescription: string) => Promise.resolve({
      data: 'id: 999',
      status: mockHttpStatusCode.created,
   }),
   put: async (_role: RoleUI) => Promise.resolve({ status: mockHttpStatusCode.OK }),
}));

jest.mock('./common/hooks/endpoints/useRolePermissionEndpoint', () => ({
   delete: async (_id: number) => Promise.resolve({ status: mockHttpStatusCode.OK }),
   get: async () => Promise.resolve({
      data: mockRolePermissions.get,
      status: mockHttpStatusCode.OK,
   }),
   post: async (_permissionId: number, _roleId: number) => Promise.resolve({
      data: 'id: 999',
      status: mockHttpStatusCode.created,
   }),
}));

jest.mock('./common/hooks/endpoints/useUserEndpoint', () => ({
   delete: async (_id: number) => Promise.resolve({ status: mockHttpStatusCode.OK }),
   get: async () => Promise.resolve({
      data: mockUsers.get,
      status: mockHttpStatusCode.OK,
   }),
   put: async (_user: UserUI) => Promise.resolve({ status: mockHttpStatusCode.OK }),
}));

jest.mock('./common/hooks/endpoints/useUserRoleEndpoint', () => ({
   delete: async (_id: number) => Promise.resolve({ status: mockHttpStatusCode.OK }),
   get: async () => Promise.resolve({
      data: mockUserRoles.get,
      status: mockHttpStatusCode.OK,
   }),
   post: async (_roleId: number, _userId: number) => Promise.resolve({
      data: 'id: 999',
      status: mockHttpStatusCode.created,
   }),
}));