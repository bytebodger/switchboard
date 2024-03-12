import { reshape } from './reshape';

describe('reshape library', () => {
   const audienceMemberDB = {
      birth_date: 'birthDate',
      city: 'city',
      email: 'email',
      first_name: 'firstName',
      gender: 'gender',
      landing_link: 'landingLink',
      last_name: 'lastName',
      launch_group: 'launchGroup',
      mbi_id: 'mbiId',
      mobile_number: 'mobileNumber',
      organization_name: 'organization',
      pcp_clinic_group: 'pcpClinicGroup',
      pcp_first_name: 'pcpFirstName',
      pcp_last_name: 'pcpLastName',
      pcp_npi: 'pcpNpi',
      primary_language: 'primaryLanguage',
      provider_name: 'provider',
      recruitment_id: 0,
      spp_person_id: 1,
      state: 'state',
      street_address: 'streetAddress',
      zip_code: 'zipCode',
   }
   const audienceMemberUI = {
      birthDate: 'birthDate',
      city: 'city',
      email: 'email',
      firstName: 'firstName',
      gender: 'gender',
      id: 0,
      landingLink: 'landingLink',
      lastName: 'lastName',
      launchGroup: 'launchGroup',
      mbiId: 'mbiId',
      mobileNumber: 'mobileNumber',
      organization: 'organization',
      pcpClinicGroup: 'pcpClinicGroup',
      pcpFirstName: 'pcpFirstName',
      pcpLastName: 'pcpLastName',
      pcpNpi: 'pcpNpi',
      personId: 1,
      primaryLanguage: 'primaryLanguage',
      provider: 'provider',
      state: 'state',
      streetAddress: 'streetAddress',
      zipCode: 'zipCode',
   }
   const campaignDB = {
      campaign_flag: false,
      disabled_datetime_utc: 'disabledOn',
      disabled_flag: false,
      experiment_begin_datetime_utc: 'beginOn',
      experiment_desc: 'description',
      experiment_end_datetime_utc: 'endOn',
      experiment_name: 'name',
      owner_ref_user_id: 4,
      ref_experiment_id: 2,
      row_created_datetime_utc: 'createdOn',
      row_created_user_id: 1,
      row_modified_datetime_utc: 'modifiedOn',
      row_modified_user_id: 3,
      sender_ref_user_id: 5,
      sender_ref_user_name: 'sendFromName',
      success_metric: 'successMetric',
   }
   const campaignTagDB = {
      experiment_tag_name: 'name',
      expertiment_tag_desc: 'description',
      ref_experiment_tag_id: 1,
   }
   const campaignTagRelationshipDB = {
      experiment_tag_id: 1,
      ref_experiment_id: 2,
      ref_experiment_tag_id: 3,
   }
   const campaignTagRelationshipUI = {
      experimentId: 2,
      experimentTagId: 3,
      id: 1,
   }
   const campaignTagUI = {
      description: 'description',
      id: 1,
      name: 'name',
   }
   const campaignUI = {
      beginOn: 'beginOn',
      createdBy: 1,
      createdOn: 'createdOn',
      description: 'description',
      disabledOn: 'disabledOn',
      endOn: 'endOn',
      id: 2,
      isCampaign: false,
      isDisabled: false,
      modifiedBy: 3,
      modifiedOn: 'modifiedOn',
      name: 'name',
      ownedBy: 4,
      sendFrom: 5,
      sendFromName: 'sendFromName',
      successMetric: 'successMetric',
   }
   const cohortDB = {
      comparator: 'comparator',
      experiment_filter_id: 1,
      field_name: 'field',
      ordinal: 2,
      ref_experiment_id: 3,
      table_name: 'table',
      value: 'value',
   }
   const cohortUI = {
      comparator: 'comparator',
      experimentId: 3,
      field: 'field',
      id: 1,
      ordinal: 2,
      table: 'table',
      value: 'value',
   }
   const emailDB = {
      deleted_datetime_utc: 'deletedOn',
      email_message: 'message',
      email_message_html: 'htmlMessage',
      email_subject: 'subject',
      mode_tag_desc: 'tagDescription',
      mode_tag_name: 'tagName',
      recipient_clicked_datetime_utc: 'clickedOn',
      recipient_email: 'recipientEmail',
      ref_mode_email_id: 0,
      ref_mode_tag_id: 1,
      sb_intervention_email_id: 2,
      sb_intervention_guid: 'guid',
      scheduled_datetime_utc: 'scheduledOn',
      sender_email: 'senderEmail',
      sender_ref_user_id: 3,
      sent_datetime_utc: 'sentOn',
      spp_person_id: 4,
      switchboard_aiml_algorithm_id: 5,
   }
   const emailTemplateDB = {
      email_message: 'message',
      email_message_html: 'htmlMessage',
      email_subject: 'subject',
      ref_experiment_id: 3,
      ref_mode_email_id: 1,
      send_on_datetime_utc: 'sendOn',
      switchboard_aiml_algorithm_id: 2,
      weight: 4,
   }
   const emailTemplateTagDB = {
      mode_email_tag_id: 1,
      ref_mode_email_id: 2,
      ref_mode_tag_id: 3,
   }
   const emailTemplateTagUI = {
      emailTemplateId: 2,
      id: 1,
      messageTagId: 3,
   }
   const emailTemplateUI = {
      aimlId: 2,
      experimentId: 3,
      htmlMessage: 'htmlMessage',
      id: 1,
      message: 'message',
      sendOn: 'sendOn',
      subject: 'subject',
      weight: 4,
   }
   const emailUI = {
      aimlId: 5,
      clickedOn: 'clickedOn',
      deletedOn: 'deletedOn',
      emailTemplateId: 0,
      guid: 'guid',
      htmlMessage: 'htmlMessage',
      id: 2,
      message: 'message',
      messageTagId: 1,
      personId: 4,
      recipientEmail: 'recipientEmail',
      sendFrom: 3,
      sendOn: 'scheduledOn',
      senderEmail: 'senderEmail',
      sentOn: 'sentOn',
      subject: 'subject',
      tagDescription: 'tagDescription',
      tagName: 'tagName',
   }
   const experimentDB = {
      campaign_flag: false,
      disabled_datetime_utc: 'disabledOn',
      disabled_flag: false,
      experiment_begin_datetime_utc: 'beginOn',
      experiment_desc: 'description',
      experiment_end_datetime_utc: 'endOn',
      experiment_name: 'name',
      owner_ref_user_id: 4,
      ref_experiment_id: 2,
      row_created_datetime_utc: 'createdOn',
      row_created_user_id: 1,
      row_modified_datetime_utc: 'modifiedOn',
      row_modified_user_id: 3,
      sender_ref_user_id: 5,
      sender_ref_user_name: 'sendFromName',
      success_metric: 'successMetric',
   }
   const experimentTagDB = {
      experiment_tag_name: 'name',
      expertiment_tag_desc: 'description',
      ref_experiment_tag_id: 1,
   }
   const experimentTagRelationshipDB = {
      experiment_tag_id: 1,
      ref_experiment_id: 2,
      ref_experiment_tag_id: 3,
   }
   const experimentTagRelationshipUI = {
      experimentId: 2,
      experimentTagId: 3,
      id: 1,
   }
   const experimentTagUI = {
      description: 'description',
      id: 1,
      name: 'name',
   }
   const experimentUI = {
      beginOn: 'beginOn',
      createdBy: 1,
      createdOn: 'createdOn',
      description: 'description',
      disabledOn: 'disabledOn',
      endOn: 'endOn',
      id: 2,
      isCampaign: false,
      isDisabled: false,
      modifiedBy: 3,
      modifiedOn: 'modifiedOn',
      name: 'name',
      ownedBy: 4,
      sendFrom: 5,
      sendFromName: 'sendFromName',
      successMetric: 'successMetric',
   }
   const hypothesisDB = {
      experiment_hypothesis_id: 1,
      hypothesis: 'hypothesis',
      ref_experiment_id: 2,
   }
   const hypothesisUI = {
      experimentId: 2,
      hypothesis: 'hypothesis',
      id: 1,
   }
   const inAppMessageDB = {
      deleted_datetime_utc: 'deletedOn',
      recipient_clicked_datetime_utc: 'clickedOn',
      recipient_person_ref_user_id: 0,
      recipient_ref_app_id: 1,
      ref_app_id: 2,
      ref_mode_in_app_message_id: 3,
      row_created_datetime_utc: 'createdOn',
      row_created_user_id: 4,
      row_modified_datetime_utc: 'modifiedOn',
      row_modified_user_id: 5,
      sb_intervention_guid: 'guid',
      sb_intervention_in_app_message_id: 6,
      scheduled_datetime_utc: 'sendOn',
      sender_person_ref_user_id: 7,
      sent_datetime_utc: 'sentOn',
      spp_person_id: 8,
      switchboard_aiml_algorithm_id: 9,
   }
   const inAppMessageTemplateDB = {
      in_app_message: 'message',
      ref_experiment_id: 1,
      ref_mode_in_app_message_id: 2,
      row_created_datetime_utc: 'createdOn',
      row_created_user_id: 3,
      row_modified_datetime_utc: 'modifiedOn',
      row_modified_user_id: 4,
      send_on_datetime_utc: 'sendOn',
      switchboard_aiml_algorithm_id: null,
      weight: 5,
   }
   const inAppMessageTemplateTagDB = {
      mode_in_app_message_tag_id: 1,
      ref_mode_in_app_message_id: 2,
      ref_mode_tag_id: 3,
      row_created_datetime_utc: 'createdOn',
      row_created_user_id: 4,
      row_modified_datetime_utc: 'modifiedOn',
      row_modified_user_id: 5,
   }
   const inAppMessageTemplateTagUI = {
      createdBy: 4,
      createdOn: 'createdOn',
      id: 1,
      inAppMessageTemplateId: 2,
      messageTagId: 3,
      modifiedBy: 5,
      modifiedOn: 'modifiedOn',
   }
   const inAppMessageTemplateUI = {
      aimlId: null,
      createdBy: 3,
      createdOn: 'createdOn',
      experimentId: 1,
      id: 2,
      message: 'message',
      modifiedBy: 4,
      modifiedOn: 'modifiedOn',
      sendOn: 'sendOn',
      weight: 5,
   }
   const inAppMessageUI = {
      aimlId: 9,
      appId: 2,
      clickedOn: 'clickedOn',
      createdBy: 4,
      createdOn: 'createdOn',
      deletedOn: 'deletedOn',
      guid: 'guid',
      id: 6,
      inAppMessageTemplateId: 3,
      modifiedBy: 5,
      modifiedOn: 'modifiedOn',
      personId: 8,
      recipientAppId: 1,
      sendFrom: 7,
      sendOn: 'sendOn',
      sendTo: 0,
      sentOn: 'sentOn',
   }
   const messageTagDB = {
      mode_tag_desc: 'description',
      mode_tag_name: 'name',
      ref_mode_tag_id: 1,
   }
   const messageTagUI = {
      description: 'description',
      id: 1,
      name: 'name',
   }
   const patchDB = {
      op: 'replace',
      path: 'property',
      value: 'value',
   }
   const patchUI = {
      property: 'property',
      value: 'value',
   }
   const permissionDB = {
      app_access_desc: 'description',
      app_access_display_name: 'displayName',
      app_access_name: 'name',
      disabled_datetime_utc: null,
      disabled_flag: false,
      ref_app_access_id: 1,
   }
   const permissionUI = {
      description: 'description',
      disabledOn: null,
      displayName: 'displayName',
      id: 1,
      isDisabled: false,
      name: 'name',
   }
   const personDB = {
      gpp_person_id: 0,
      ref_experiment_id: 1,
      spp_person_id: 2,
      switchboard_aiml_algorithm_id: 3,
   }
   const personUI = {
      aimlId: 3,
      experimentId: 1,
      gppPersonId: 0,
      sppPersonId: 2,
   }
   const pimDB = {
      is_success: true,
      message: 'message',
   }
   const pimUI = {
      isSuccess: true,
      message: 'message',
   }
   const roleDB = {
      disabled_flag: false,
      dp_request_access_flag: false,
      ref_role_id: 1,
      role_desc: 'description',
      role_name: 'Test Role',
   }
   const rolePermissionDB = {
      ref_app_access_id: 2,
      ref_role_id: 5,
      role_app_access_id: 4,
      row_created_datetime_utc: 'some date',
      row_created_user_id: 1,
      row_modified_datetime_utc: 'another date',
      row_modified_user_id: 3,
   }
   const rolePermissionUI = {
      createdBy: 1,
      createdOn: 'some date',
      id: 4,
      modifiedBy: 3,
      modifiedOn: 'another date',
      permissionId: 2,
      roleId: 5,
   }
   const roleUI = {
      description: 'description',
      id: 1,
      isDisabled: false,
      name: 'Test Role',
   }
   const textDB = {
      deleted_datetime_utc: 'deletedOn',
      recipient_clicked_datetime_utc: 'clickedOn',
      recipient_phone: 'recipientPhone',
      ref_mode_text_id: 0,
      sb_intervention_guid: 'guid',
      scheduled_datetime_utc: 'scheduledOn',
      sender_person_ref_user_id: 1,
      sender_phone: 'senderPhone',
      sent_datetime_utc: 'sentOn',
      spp_person_id: 2,
      switchboard_aiml_algorithm_id: 3,
   }
   const textTemplateDB = {
      ref_experiment_id: 1,
      ref_mode_text_id: 2,
      row_created_datetime_utc: 'createdOn',
      row_created_user_id: 3,
      row_modified_datetime_utc: 'modifiedOn',
      row_modified_user_id: 4,
      send_on_datetime_utc: 'sendOn',
      switchboard_aiml_algorithm_id: null,
      text_message: 'message',
      weight: 5,
   }
   const textTemplateTagDB = {
      mode_text_tag_id: 1,
      ref_mode_tag_id: 2,
      ref_mode_text_id: 3,
      row_created_datetime_utc: 'createdOn',
      row_created_user_id: 4,
      row_modified_datetime_utc: 'modifiedOn',
      row_modified_user_id: 5,
   }
   const textTemplateTagUI = {
      createdBy: 4,
      createdOn: 'createdOn',
      id: 1,
      messageTagId: 2,
      modifiedBy: 5,
      modifiedOn: 'modifiedOn',
      textTemplateId: 3,
   }
   const textTemplateUI = {
      aimlId: null,
      createdBy: 3,
      createdOn: 'createdOn',
      experimentId: 1,
      id: 2,
      message: 'message',
      modifiedBy: 4,
      modifiedOn: 'modifiedOn',
      sendOn: 'sendOn',
      weight: 5,
   }
   const textUI = {
      aimlId: 3,
      clickedOn: 'clickedOn',
      deletedOn: 'deletedOn',
      guid: 'guid',
      personId: 2,
      recipientPhone: 'recipientPhone',
      sendFrom: 1,
      sendOn: 'scheduledOn',
      senderPhone: 'senderPhone',
      sentOn: 'sentOn',
      textTemplateId: 0,
   }
   const userDB = {
      account_verified_datetime_utc: 'verifiedOn',
      account_verified_flag: false,
      avatar_url: 'avatarUrl',
      disabled_datetime_utc: 'disabledOn',
      disabled_flag: false,
      email: 'email',
      first_name: 'firstName',
      last_name: 'lastName',
      middle_name: 'middleName',
      ref_user_id: 0,
      row_created_by_user_name: 'createdBy',
      row_modified_by_user_name: 'modifiedBy',
      sso_object_id: 'guid',
   }
   const userDemographicDB = {
      data_format: null,
      data_length: 1,
      data_type: 'type',
      demographic_desc: 'description',
      demographic_label: 'label',
      demographic_name: 'name',
      demographic_value: 'value',
      disabled_datetime_utc: 'disabledOn',
      disabled_flag: false,
      ref_demographic_id: 2,
      ref_user_id: 3,
      required_field_flag: false,
      row_created_by_user_name: 'createdByName',
      row_created_datetime_utc: 'createdOn',
      row_created_user_id: 4,
      row_modified_by_user_name: 'modifiedByName',
      row_modified_datetime_utc: 'modifiedOn',
      row_modified_user_id: 5,
      user_demographic_id: 6,
   }
   const userDemographicUI = {
      createdBy: 4,
      createdByName: 'createdByName',
      createdOn: 'createdOn',
      demographicId: 2,
      description: 'description',
      disabledOn: 'disabledOn',
      format: null,
      id: 6,
      isDisabled: false,
      isRequired: false,
      label: 'label',
      length: 1,
      modifiedBy: 5,
      modifiedByName: 'modifiedByName',
      modifiedOn: 'modifiedOn',
      name: 'name',
      type: 'type',
      userId: 3,
      value: 'value',
   }
   const userUI = {
      accountVerifiedOn: 'verifiedOn',
      avatarUrl: 'avatarUrl',
      createdBy: 'createdBy',
      disabledOn: 'disabledOn',
      email: 'email',
      firstName: 'firstName',
      id: 0,
      isAccountVerified: false,
      isDisabled: false,
      lastName: 'lastName',
      middleName: 'middleName',
      modifiedBy: 'modifiedBy',
      ssoObjectId: 'guid',
   }
   const userRoleDB = {
      disabled_datetime_utc: 'disabledOn',
      disabled_flag: false,
      ref_role_id: 0,
      ref_user_id: 1,
      role_desc: 'roleDescription',
      role_name: 'roleName',
      user_role_id: 2,
   }
   const userRoleUI = {
      disabledOn: 'disabledOn',
      id: 2,
      isDisabled: false,
      roleDescription: 'roleDescription',
      roleId: 0,
      roleName: 'roleName',
      userId: 1,
   }

   test('audienceMember.DB2UI', () => {
      expect(reshape.audienceMember.DB2UI(audienceMemberDB)).toEqual(audienceMemberUI);
   })

   test('audienceMember.UI2DB', () => {
      expect(reshape.audienceMember.UI2DB(audienceMemberUI)).toEqual(audienceMemberDB);
   })

   test('campaign.DB2UI', () => {
      expect(reshape.campaign.DB2UI(campaignDB)).toEqual(campaignUI);
   })

   test('campaign.UI2DB', () => {
      expect(reshape.campaign.UI2DB(campaignUI)).toEqual(campaignDB);
   })

   test('campaignTag.DB2UI', () => {
      expect(reshape.campaignTag.DB2UI(campaignTagDB)).toEqual(campaignTagUI);
   })

   test('campaignTag.UI2DB', () => {
      expect(reshape.campaignTag.UI2DB(campaignTagUI)).toEqual(campaignTagDB);
   })

   test('campaignTagRelationship.DB2UI', () => {
      expect(reshape.campaignTagRelationship.DB2UI(campaignTagRelationshipDB)).toEqual(campaignTagRelationshipUI);
   })

   test('campaignTagRelationship.UI2DB', () => {
      expect(reshape.campaignTagRelationship.UI2DB(campaignTagRelationshipUI)).toEqual(campaignTagRelationshipDB);
   })

   test('cohort.DB2UI', () => {
      expect(reshape.cohort.DB2UI(cohortDB)).toEqual(cohortUI);
   })

   test('cohort.UI2DB', () => {
      expect(reshape.cohort.UI2DB(cohortUI)).toEqual(cohortDB);
   })

   test('email.DB2UI', () => {
      expect(reshape.email.DB2UI(emailDB)).toEqual(emailUI);
   })

   test('email.UI2DB', () => {
      expect(reshape.email.UI2DB(emailUI)).toEqual(emailDB);
   })

   test('emailTemplate.DB2UI', () => {
      expect(reshape.emailTemplate.DB2UI(emailTemplateDB)).toEqual(emailTemplateUI);
   })

   test('emailTemplate.UI2DB', () => {
      expect(reshape.emailTemplate.UI2DB(emailTemplateUI)).toEqual(emailTemplateDB);
   })

   test('emailTemplateTag.DB2UI', () => {
      expect(reshape.emailTemplateTag.DB2UI(emailTemplateTagDB)).toEqual(emailTemplateTagUI);
   })

   test('emailTemplateTag.UI2DB', () => {
      expect(reshape.emailTemplateTag.UI2DB(emailTemplateTagUI)).toEqual(emailTemplateTagDB);
   })

   test('experiment.DB2UI', () => {
      expect(reshape.experiment.DB2UI(experimentDB)).toEqual(experimentUI);
   })

   test('experiment.UI2DB', () => {
      expect(reshape.experiment.UI2DB(experimentUI)).toEqual(experimentDB);
   })

   test('experimentTag.DB2UI', () => {
      expect(reshape.experimentTag.DB2UI(experimentTagDB)).toEqual(experimentTagUI);
   })

   test('experimentTag.UI2DB', () => {
      expect(reshape.experimentTag.UI2DB(experimentTagUI)).toEqual(experimentTagDB);
   })

   test('experimentTagRelationship.DB2UI', () => {
      expect(reshape.experimentTagRelationship.DB2UI(experimentTagRelationshipDB)).toEqual(experimentTagRelationshipUI);
   })

   test('experimentTagRelationship.UI2DB', () => {
      expect(reshape.experimentTagRelationship.UI2DB(experimentTagRelationshipUI)).toEqual(experimentTagRelationshipDB);
   })

   test('hypothesis.DB2UI', () => {
      expect(reshape.hypothesis.DB2UI(hypothesisDB)).toEqual(hypothesisUI);
   })

   test('hypothesis.UI2DB', () => {
      expect(reshape.hypothesis.UI2DB(hypothesisUI)).toEqual(hypothesisDB);
   })

   test('inAppMessage.DB2UI', () => {
      expect(reshape.inAppMessage.DB2UI(inAppMessageDB)).toEqual(inAppMessageUI);
   })

   test('inAppMessage.UI2DB', () => {
      expect(reshape.inAppMessage.UI2DB(inAppMessageUI)).toEqual(inAppMessageDB);
   })

   test('inAppMessageTemplate.DB2UI', () => {
      expect(reshape.inAppMessageTemplate.DB2UI(inAppMessageTemplateDB)).toEqual(inAppMessageTemplateUI);
   })

   test('inAppMessageTemplate.UI2DB', () => {
      expect(reshape.inAppMessageTemplate.UI2DB(inAppMessageTemplateUI)).toEqual(inAppMessageTemplateDB);
   })

   test('inAppMessageTemplateTag.DB2UI', () => {
      expect(reshape.inAppMessageTemplateTag.DB2UI(inAppMessageTemplateTagDB)).toEqual(inAppMessageTemplateTagUI);
   })

   test('inAppMessageTemplateTag.UI2DB', () => {
      expect(reshape.inAppMessageTemplateTag.UI2DB(inAppMessageTemplateTagUI)).toEqual(inAppMessageTemplateTagDB);
   })

   test('messageTag.DB2UI', () => {
      expect(reshape.messageTag.DB2UI(messageTagDB)).toEqual(messageTagUI);
   })

   test('messageTag.UI2DB', () => {
      expect(reshape.messageTag.UI2DB(messageTagUI)).toEqual(messageTagDB);
   })

   test('patch.UI2DB', () => {
      expect(reshape.patch.UI2DB(patchUI)).toEqual(patchDB);
   })

   test('permission.DB2UI', () => {
      expect(reshape.permission.DB2UI(permissionDB)).toEqual(permissionUI);
   })

   test('permission.UI2DB', () => {
      expect(reshape.permission.UI2DB(permissionUI)).toEqual(permissionDB);
   })

   test('person.DB2UI', () => {
      expect(reshape.person.DB2UI(personDB)).toEqual(personUI);
   })

   test('person.UI2DB', () => {
      expect(reshape.person.UI2DB(personUI)).toEqual(personDB);
   })

   test('pim.DB2UI', () => {
      expect(reshape.pim.DB2UI(pimDB)).toEqual(pimUI);
   })

   test('role.DB2UI', () => {
      expect(reshape.role.DB2UI(roleDB)).toEqual(roleUI);
   })

   test('role.UI2DB', () => {
      expect(reshape.role.UI2DB(roleUI)).toEqual(roleDB);
   })

   test('rolePermission.DB2UI', () => {
      expect(reshape.rolePermission.DB2UI(rolePermissionDB)).toEqual(rolePermissionUI);
   })

   test('text.DB2UI', () => {
      expect(reshape.text.DB2UI(textDB)).toEqual(textUI);
   })

   test('text.UI2DB', () => {
      expect(reshape.text.UI2DB(textUI)).toEqual(textDB);
   })

   test('textTemplate.DB2UI', () => {
      expect(reshape.textTemplate.DB2UI(textTemplateDB)).toEqual(textTemplateUI);
   })

   test('textTemplate.UI2DB', () => {
      expect(reshape.textTemplate.UI2DB(textTemplateUI)).toEqual(textTemplateDB);
   })

   test('textTemplateTag.DB2UI', () => {
      expect(reshape.textTemplateTag.DB2UI(textTemplateTagDB)).toEqual(textTemplateTagUI);
   })

   test('textTemplateTag.UI2DB', () => {
      expect(reshape.textTemplateTag.UI2DB(textTemplateTagUI)).toEqual(textTemplateTagDB);
   })

   test('user.DB2UI', () => {
      expect(reshape.user.DB2UI(userDB)).toEqual(userUI);
   })

   test('user.UI2DB', () => {
      expect(reshape.user.UI2DB(userUI)).toEqual(userDB);
   })

   test('userDemographic.DB2UI', () => {
      expect(reshape.userDemographic.DB2UI(userDemographicDB)).toEqual(userDemographicUI);
   })

   test('userDemographic.UI2DB', () => {
      expect(reshape.userDemographic.UI2DB(userDemographicUI)).toEqual(userDemographicDB);
   })

   test('userRole.DB2UI', () => {
      expect(reshape.userRole.DB2UI(userRoleDB)).toEqual(userRoleUI);
   })

   test('userRole.UI2DB', () => {
      expect(reshape.userRole.UI2DB(userRoleUI)).toEqual(userRoleDB);
   })
})