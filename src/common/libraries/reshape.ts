import type { AudienceMemberDB } from '../interfaces/audienceMember/AudienceMemberDB';
import type { AudienceMemberUI } from '../interfaces/audienceMember/AudienceMemberUI';
import type { CohortDB } from '../interfaces/cohort/CohortDB';
import type { CohortUI } from '../interfaces/cohort/CohortUI';
import type { EmailDB } from '../interfaces/email/EmailDB';
import type { EmailUI } from '../interfaces/email/EmailUI';
import type { EmailTemplateDB } from '../interfaces/emailTemplate/EmailTemplateDB';
import type { EmailTemplateUI } from '../interfaces/emailTemplate/EmailTemplateUI';
import type { EmailTemplateTagDB } from '../interfaces/emailTemplateTag/EmailTemplateTagDB';
import type { EmailTemplateTagUI } from '../interfaces/emailTemplateTag/EmailTemplateTagUI';
import type { CampaignDB, ExperimentDB } from '../interfaces/experiment/ExperimentDB';
import type { CampaignUI, ExperimentUI } from '../interfaces/experiment/ExperimentUI';
import type { CampaignTagDB, ExperimentTagDB } from '../interfaces/experimentTag/ExperimentTagDB';
import type { CampaignTagUI, ExperimentTagUI } from '../interfaces/experimentTag/ExperimentTagUI';
import type { CampaignTagRelationshipDB, ExperimentTagRelationshipDB } from '../interfaces/experimentTagRelationship/ExperimentTagRelationshipDB';
import type { CampaignTagRelationshipUI, ExperimentTagRelationshipUI } from '../interfaces/experimentTagRelationship/ExperimentTagRelationshipUI';
import type { HypothesisDB } from '../interfaces/hypothesis/HypothesisDB';
import type { HypothesisUI } from '../interfaces/hypothesis/HypothesisUI';
import type { InAppMessageDB } from '../interfaces/inAppMessage/InAppMessageDB';
import type { InAppMessageUI } from '../interfaces/inAppMessage/InAppMessageUI';
import type { InAppMessageTemplateDB } from '../interfaces/inAppMessageTemplate/InAppMessageTemplateDB';
import type { InAppMessageTemplateUI } from '../interfaces/inAppMessageTemplate/InAppMessageTemplateUI';
import type { InAppMessageTemplateTagDB } from '../interfaces/inAppMessageTemplateTag/InAppMessageTemplateTagDB';
import type { InAppMessageTemplateTagUI } from '../interfaces/inAppMessageTemplateTag/InAppMessageTemplateTagUI';
import type { MessageTagDB } from '../interfaces/messageTag/MessageTagDB';
import type { MessageTagUI } from '../interfaces/messageTag/MessageTagUI';
import type { PatchDB } from '../interfaces/patch/PatchDB';
import type { PatchUI } from '../interfaces/patch/PatchUI';
import type { PermissionDB } from '../interfaces/permission/PermissionDB';
import type { PermissionUI } from '../interfaces/permission/PermissionUI';
import type { PersonDB } from '../interfaces/person/PersonDB';
import type { PersonUI } from '../interfaces/person/PersonUI';
import type { PimDB } from '../interfaces/pim/PimDB';
import type { PimUI } from '../interfaces/pim/PimUI';
import type { RoleDB } from '../interfaces/role/RoleDB';
import type { RoleUI } from '../interfaces/role/RoleUI';
import type { RolePermissionDB } from '../interfaces/rolePermission/RolePermissionDB';
import type { RolePermissionUI } from '../interfaces/rolePermission/RolePermissionUI';
import type { TextDB } from '../interfaces/text/TextDB';
import type { TextUI } from '../interfaces/text/TextUI';
import type { TextTemplateDB } from '../interfaces/textTemplate/TextTemplateDB';
import type { TextTemplateUI } from '../interfaces/textTemplate/TextTemplateUI';
import type { TextTemplateTagDB } from '../interfaces/textTemplateTag/TextTemplateTagDB';
import type { TextTemplateTagUI } from '../interfaces/textTemplateTag/TextTemplateTagUI';
import type { UserDB } from '../interfaces/user/UserDB';
import type { UserUI } from '../interfaces/user/UserUI';
import type { UserDemographicDB } from '../interfaces/userDemographic/UserDemographicDB';
import type { UserDemographicUI } from '../interfaces/userDemographic/UserDemographicUI';
import type { UserRoleDB } from '../interfaces/userRole/UserRoleDB';
import type { UserRoleUI } from '../interfaces/userRole/UserRoleUI';

export const reshape = (() => {
   const audienceMemberDB2UI = (audienceMember: AudienceMemberDB): AudienceMemberUI => ({
      birthDate: audienceMember.birth_date,
      city: audienceMember.city,
      email: audienceMember.email,
      firstName: audienceMember.first_name,
      gender: audienceMember.gender,
      id: audienceMember.recruitment_id,
      landingLink: audienceMember.landing_link,
      lastName: audienceMember.last_name,
      launchGroup: audienceMember.launch_group,
      mbiId: audienceMember.mbi_id,
      mobileNumber: audienceMember.mobile_number,
      organization: audienceMember.organization_name,
      pcpClinicGroup: audienceMember.pcp_clinic_group,
      pcpFirstName: audienceMember.pcp_first_name,
      pcpLastName: audienceMember.pcp_last_name,
      pcpNpi: audienceMember.pcp_npi,
      personId: audienceMember.spp_person_id,
      primaryLanguage: audienceMember.primary_language,
      provider: audienceMember.provider_name,
      state: audienceMember.state,
      streetAddress: audienceMember.street_address,
      zipCode: audienceMember.zip_code,
   })

   const audienceMemberUI2DB = (audienceMember: AudienceMemberUI): AudienceMemberDB => ({
      birth_date: audienceMember.birthDate,
      city: audienceMember.city,
      email: audienceMember.email,
      first_name: audienceMember.firstName,
      gender: audienceMember.gender,
      landing_link: audienceMember.landingLink,
      last_name: audienceMember.lastName,
      launch_group: audienceMember.launchGroup,
      mbi_id: audienceMember.mbiId,
      mobile_number: audienceMember.mobileNumber,
      organization_name: audienceMember.organization,
      pcp_clinic_group: audienceMember.pcpClinicGroup,
      pcp_first_name: audienceMember.pcpFirstName,
      pcp_last_name: audienceMember.pcpLastName,
      pcp_npi: audienceMember.pcpNpi,
      primary_language: audienceMember.primaryLanguage,
      provider_name: audienceMember.provider,
      recruitment_id: audienceMember.id,
      spp_person_id: audienceMember.personId,
      state: audienceMember.state,
      street_address: audienceMember.streetAddress,
      zip_code: audienceMember.zipCode,
   })

   const campaignDB2UI = (campaign: CampaignDB): CampaignUI => ({
      beginOn: campaign.experiment_begin_datetime_utc,
      createdBy: campaign.row_created_user_id,
      createdOn: campaign.row_created_datetime_utc,
      description: campaign.experiment_desc,
      disabledOn: campaign.disabled_datetime_utc,
      endOn: campaign.experiment_end_datetime_utc,
      id: campaign.ref_experiment_id,
      isCampaign: campaign.campaign_flag,
      isDisabled: campaign.disabled_flag,
      modifiedBy: campaign.row_modified_user_id,
      modifiedOn: campaign.row_modified_datetime_utc,
      name: campaign.experiment_name,
      ownedBy: campaign.owner_ref_user_id,
      sendFrom: campaign.sender_ref_user_id,
      sendFromName: campaign.sender_ref_user_name,
      successMetric: campaign.success_metric,
   })

   const campaignTagDB2UI = (campaignTag: CampaignTagDB): CampaignTagUI => ({
      description: campaignTag.expertiment_tag_desc,
      id: campaignTag.ref_experiment_tag_id,
      name: campaignTag.experiment_tag_name,
   })

   const campaignTagRelationshipDB2UI = (campaignTagRelationship: CampaignTagRelationshipDB): CampaignTagRelationshipUI => ({
      experimentId: campaignTagRelationship.ref_experiment_id,
      experimentTagId: campaignTagRelationship.ref_experiment_tag_id,
      id: campaignTagRelationship.experiment_tag_id,
   })

   const campaignTagRelationshipUI2DB = (campaignTagRelationship: CampaignTagRelationshipUI): CampaignTagRelationshipDB => ({
      experiment_tag_id: campaignTagRelationship.id,
      ref_experiment_id: campaignTagRelationship.experimentId,
      ref_experiment_tag_id: campaignTagRelationship.experimentTagId,
   })

   const campaignTagUI2DB = (campaignTagUI: CampaignTagUI): CampaignTagDB => ({
      experiment_tag_name: campaignTagUI.name,
      expertiment_tag_desc: campaignTagUI.description,
      ref_experiment_tag_id: campaignTagUI.id,
   })

   const campaignUI2DB = (campaign: CampaignUI): CampaignDB => ({
      campaign_flag: campaign.isCampaign,
      disabled_datetime_utc: campaign.disabledOn,
      disabled_flag: campaign.isDisabled,
      experiment_begin_datetime_utc: campaign.beginOn,
      experiment_desc: campaign.description,
      experiment_end_datetime_utc: campaign.endOn,
      experiment_name: campaign.name,
      owner_ref_user_id: campaign.ownedBy,
      ref_experiment_id: campaign.id,
      row_created_datetime_utc: campaign.createdOn,
      row_created_user_id: campaign.createdBy,
      row_modified_datetime_utc: campaign.modifiedOn,
      row_modified_user_id: campaign.modifiedBy,
      sender_ref_user_id: campaign.sendFrom,
      sender_ref_user_name: campaign.sendFromName,
      success_metric: campaign.successMetric,
   })

   const cohortDB2UI = (cohort: CohortDB): CohortUI => ({
      comparator: cohort.comparator,
      experimentId: cohort.ref_experiment_id,
      field: cohort.field_name,
      id: cohort.experiment_filter_id,
      ordinal: cohort.ordinal,
      table: cohort.table_name,
      value: cohort.value,
   })

   const cohortUI2DB = (cohort: CohortUI): CohortDB => ({
      comparator: cohort.comparator,
      experiment_filter_id: cohort.id,
      field_name: cohort.field,
      ordinal: cohort.ordinal,
      ref_experiment_id: cohort.experimentId,
      table_name: cohort.table,
      value: cohort.value,
   })

   const emailDB2UI = (email: EmailDB): EmailUI => ({
      aimlId: email.switchboard_aiml_algorithm_id,
      clickedOn: email.recipient_clicked_datetime_utc,
      deletedOn: email.deleted_datetime_utc,
      emailTemplateId: email.ref_mode_email_id,
      guid: email.sb_intervention_guid,
      htmlMessage: email.email_message_html,
      id: email.sb_intervention_email_id,
      message: email.email_message,
      messageTagId: email.ref_mode_tag_id,
      personId: email.spp_person_id,
      recipientEmail: email.recipient_email,
      sendFrom: email.sender_ref_user_id,
      sendOn: email.scheduled_datetime_utc,
      senderEmail: email.sender_email,
      sentOn: email.sent_datetime_utc,
      subject: email.email_subject,
      tagDescription: email.mode_tag_desc,
      tagName: email.mode_tag_name,
   })

   const emailTemplateDB2UI = (emailTemplate: EmailTemplateDB): EmailTemplateUI => ({
      aimlId: emailTemplate.switchboard_aiml_algorithm_id,
      experimentId: emailTemplate.ref_experiment_id,
      htmlMessage: emailTemplate.email_message_html,
      id: emailTemplate.ref_mode_email_id,
      message: emailTemplate.email_message,
      sendOn: emailTemplate.send_on_datetime_utc,
      subject: emailTemplate.email_subject,
      weight: emailTemplate.weight,
   })

   const emailTemplateTagDB2UI = (emailTemplateTag: EmailTemplateTagDB): EmailTemplateTagUI => ({
      emailTemplateId: emailTemplateTag.ref_mode_email_id,
      id: emailTemplateTag.mode_email_tag_id,
      messageTagId: emailTemplateTag.ref_mode_tag_id,
   })

   const emailTemplateTagUI2DB = (emailTemplateTag: EmailTemplateTagUI): EmailTemplateTagDB => ({
      mode_email_tag_id: emailTemplateTag.id,
      ref_mode_email_id: emailTemplateTag.emailTemplateId,
      ref_mode_tag_id: emailTemplateTag.messageTagId,
   })

   const emailTemplateUI2DB = (emailTemplate: EmailTemplateUI): EmailTemplateDB => ({
      email_message: emailTemplate.message,
      email_message_html: emailTemplate.htmlMessage,
      email_subject: emailTemplate.subject,
      ref_experiment_id: emailTemplate.experimentId,
      ref_mode_email_id: emailTemplate.id,
      send_on_datetime_utc: emailTemplate.sendOn,
      switchboard_aiml_algorithm_id: emailTemplate.aimlId,
      weight: emailTemplate.weight,
   })

   const emailUI2DB = (email: EmailUI): EmailDB => ({
      deleted_datetime_utc: email.deletedOn,
      email_message: email.message,
      email_message_html: email.htmlMessage,
      email_subject: email.subject,
      mode_tag_desc: email.tagDescription,
      mode_tag_name: email.tagName,
      recipient_clicked_datetime_utc: email.clickedOn,
      recipient_email: email.recipientEmail,
      ref_mode_email_id: email.emailTemplateId,
      ref_mode_tag_id: email.messageTagId,
      sb_intervention_email_id: email.id,
      sb_intervention_guid: email.guid,
      scheduled_datetime_utc: email.sendOn,
      sender_email: email.senderEmail,
      sender_ref_user_id: email.sendFrom,
      sent_datetime_utc: email.sentOn,
      spp_person_id: email.personId,
      switchboard_aiml_algorithm_id: email.aimlId,
   })

   const experimentDB2UI = (experiment: ExperimentDB): ExperimentUI => ({
      beginOn: experiment.experiment_begin_datetime_utc,
      createdBy: experiment.row_created_user_id,
      createdOn: experiment.row_created_datetime_utc,
      description: experiment.experiment_desc,
      disabledOn: experiment.disabled_datetime_utc,
      endOn: experiment.experiment_end_datetime_utc,
      id: experiment.ref_experiment_id,
      isCampaign: experiment.campaign_flag,
      isDisabled: experiment.disabled_flag,
      modifiedBy: experiment.row_modified_user_id,
      modifiedOn: experiment.row_modified_datetime_utc,
      name: experiment.experiment_name,
      ownedBy: experiment.owner_ref_user_id,
      sendFrom: experiment.sender_ref_user_id,
      sendFromName: experiment.sender_ref_user_name,
      successMetric: experiment.success_metric,
   })

   const experimentTagDB2UI = (experimentTag: ExperimentTagDB): ExperimentTagUI => ({
      description: experimentTag.expertiment_tag_desc,
      id: experimentTag.ref_experiment_tag_id,
      name: experimentTag.experiment_tag_name,
   })

   const experimentTagRelationshipDB2UI = (experimentTagRelationship: ExperimentTagRelationshipDB): ExperimentTagRelationshipUI => ({
      experimentId: experimentTagRelationship.ref_experiment_id,
      experimentTagId: experimentTagRelationship.ref_experiment_tag_id,
      id: experimentTagRelationship.experiment_tag_id,
   })

   const experimentTagRelationshipUI2DB = (experimentTagRelationship: ExperimentTagRelationshipUI): ExperimentTagRelationshipDB => ({
      experiment_tag_id: experimentTagRelationship.id,
      ref_experiment_id: experimentTagRelationship.experimentId,
      ref_experiment_tag_id: experimentTagRelationship.experimentTagId,
   })

   const experimentTagUI2DB = (experimentTag: ExperimentTagUI): ExperimentTagDB => ({
      experiment_tag_name: experimentTag.name,
      expertiment_tag_desc: experimentTag.description,
      ref_experiment_tag_id: experimentTag.id,
   })

   const experimentUI2DB = (experiment: ExperimentUI): ExperimentDB => ({
      campaign_flag: experiment.isCampaign,
      disabled_datetime_utc: experiment.disabledOn,
      disabled_flag: experiment.isDisabled,
      experiment_begin_datetime_utc: experiment.beginOn,
      experiment_desc: experiment.description,
      experiment_end_datetime_utc: experiment.endOn,
      experiment_name: experiment.name,
      owner_ref_user_id: experiment.ownedBy,
      ref_experiment_id: experiment.id,
      row_created_datetime_utc: experiment.createdOn,
      row_created_user_id: experiment.createdBy,
      row_modified_datetime_utc: experiment.modifiedOn,
      row_modified_user_id: experiment.modifiedBy,
      sender_ref_user_id: experiment.sendFrom,
      sender_ref_user_name: experiment.sendFromName,
      success_metric: experiment.successMetric,
   })

   const hypothesisDB2UI = (hypothesis: HypothesisDB): HypothesisUI => ({
      experimentId: hypothesis.ref_experiment_id,
      hypothesis: hypothesis.hypothesis,
      id: hypothesis.experiment_hypothesis_id,
   })

   const hypothesisUI2DB = (hypothesis: HypothesisUI): HypothesisDB => ({
      experiment_hypothesis_id: hypothesis.id,
      hypothesis: hypothesis.hypothesis,
      ref_experiment_id: hypothesis.experimentId,
   })

   const inAppMessageDB2UI = (inAppMessage: InAppMessageDB): InAppMessageUI => ({
      aimlId: inAppMessage.switchboard_aiml_algorithm_id,
      appId: inAppMessage.ref_app_id,
      clickedOn: inAppMessage.recipient_clicked_datetime_utc,
      createdBy: inAppMessage.row_created_user_id,
      createdOn: inAppMessage.row_created_datetime_utc,
      deletedOn: inAppMessage.deleted_datetime_utc,
      guid: inAppMessage.sb_intervention_guid,
      id: inAppMessage.sb_intervention_in_app_message_id,
      inAppMessageTemplateId: inAppMessage.ref_mode_in_app_message_id,
      modifiedBy: inAppMessage.row_modified_user_id,
      modifiedOn: inAppMessage.row_modified_datetime_utc,
      personId: inAppMessage.spp_person_id,
      recipientAppId: inAppMessage.recipient_ref_app_id,
      sendFrom: inAppMessage.sender_person_ref_user_id,
      sendOn: inAppMessage.scheduled_datetime_utc,
      sendTo: inAppMessage.recipient_person_ref_user_id,
      sentOn: inAppMessage.sent_datetime_utc,
   })

   const inAppMessageTemplateDB2UI = (inAppMessageTemplate: InAppMessageTemplateDB): InAppMessageTemplateUI => ({
      aimlId: inAppMessageTemplate.switchboard_aiml_algorithm_id,
      createdBy: inAppMessageTemplate.row_created_user_id,
      createdOn: inAppMessageTemplate.row_created_datetime_utc,
      experimentId: inAppMessageTemplate.ref_experiment_id,
      id: inAppMessageTemplate.ref_mode_in_app_message_id,
      message: inAppMessageTemplate.in_app_message,
      modifiedBy: inAppMessageTemplate.row_modified_user_id,
      modifiedOn: inAppMessageTemplate.row_modified_datetime_utc,
      sendOn: inAppMessageTemplate.send_on_datetime_utc,
      weight: inAppMessageTemplate.weight,
   })

   const inAppMessageTemplateTagDB2UI = (inAppMessageTemplateTag: InAppMessageTemplateTagDB): InAppMessageTemplateTagUI => ({
      createdBy: inAppMessageTemplateTag.row_created_user_id,
      createdOn: inAppMessageTemplateTag.row_created_datetime_utc,
      id: inAppMessageTemplateTag.mode_in_app_message_tag_id,
      inAppMessageTemplateId: inAppMessageTemplateTag.ref_mode_in_app_message_id,
      messageTagId: inAppMessageTemplateTag.ref_mode_tag_id,
      modifiedBy: inAppMessageTemplateTag.row_modified_user_id,
      modifiedOn: inAppMessageTemplateTag.row_modified_datetime_utc,
   })

   const inAppMessageTemplateTagUI2DB = (inAppMessageTemplateTag: InAppMessageTemplateTagUI): InAppMessageTemplateTagDB => ({
      mode_in_app_message_tag_id: inAppMessageTemplateTag.id,
      ref_mode_in_app_message_id: inAppMessageTemplateTag.inAppMessageTemplateId,
      ref_mode_tag_id: inAppMessageTemplateTag.messageTagId,
      row_created_datetime_utc: inAppMessageTemplateTag.createdOn,
      row_created_user_id: inAppMessageTemplateTag.createdBy,
      row_modified_datetime_utc: inAppMessageTemplateTag.modifiedOn,
      row_modified_user_id: inAppMessageTemplateTag.modifiedBy,
   })

   const inAppMessageTemplateUI2DB = (inAppMessageTemplate: InAppMessageTemplateUI): InAppMessageTemplateDB => ({
      in_app_message: inAppMessageTemplate.message,
      ref_experiment_id: inAppMessageTemplate.experimentId,
      ref_mode_in_app_message_id: inAppMessageTemplate.id,
      row_created_datetime_utc: inAppMessageTemplate.createdOn,
      row_created_user_id: inAppMessageTemplate.createdBy,
      row_modified_datetime_utc: inAppMessageTemplate.modifiedOn,
      row_modified_user_id: inAppMessageTemplate.modifiedBy,
      send_on_datetime_utc: inAppMessageTemplate.sendOn,
      switchboard_aiml_algorithm_id: inAppMessageTemplate.aimlId,
      weight: inAppMessageTemplate.weight,
   })

   const inAppMessageUI2DB = (inAppMessage: InAppMessageUI): InAppMessageDB => ({
      deleted_datetime_utc: inAppMessage.deletedOn,
      recipient_clicked_datetime_utc: inAppMessage.clickedOn,
      recipient_person_ref_user_id: inAppMessage.sendTo,
      recipient_ref_app_id: inAppMessage.recipientAppId,
      ref_app_id: inAppMessage.appId,
      ref_mode_in_app_message_id: inAppMessage.inAppMessageTemplateId,
      row_created_datetime_utc: inAppMessage.createdOn,
      row_created_user_id: inAppMessage.createdBy,
      row_modified_datetime_utc: inAppMessage.modifiedOn,
      row_modified_user_id: inAppMessage.modifiedBy,
      sb_intervention_guid: inAppMessage.guid,
      sb_intervention_in_app_message_id: inAppMessage.id,
      scheduled_datetime_utc: inAppMessage.sendOn,
      sender_person_ref_user_id: inAppMessage.sendFrom,
      sent_datetime_utc: inAppMessage.sentOn,
      spp_person_id: inAppMessage.personId,
      switchboard_aiml_algorithm_id: inAppMessage.aimlId,
   })

   const messageTagUI2DB = (messageTag: MessageTagUI): MessageTagDB => ({
      mode_tag_desc: messageTag.description,
      mode_tag_name: messageTag.name,
      ref_mode_tag_id: messageTag.id,
   })

   const messageTagDB2UI = (messageTag: MessageTagDB): MessageTagUI => ({
      description: messageTag.mode_tag_desc,
      id: messageTag.ref_mode_tag_id,
      name: messageTag.mode_tag_name,
   })

   const patchUI2DB = (patch: PatchUI): PatchDB => ({
      op: 'replace',
      path: patch.property,
      value: patch.value,
   })

   const permissionDB2UI = (permission: PermissionDB): PermissionUI => ({
      description: permission.app_access_desc,
      disabledOn: permission.disabled_datetime_utc,
      displayName: permission.app_access_display_name,
      id: permission.ref_app_access_id,
      isDisabled: permission.disabled_flag,
      name: permission.app_access_name,
   })

   const permissionUI2DB = (permission: PermissionUI): PermissionDB => ({
      app_access_desc: permission.description,
      app_access_display_name: permission.displayName,
      app_access_name: permission.name,
      disabled_datetime_utc: permission.disabledOn,
      disabled_flag: permission.isDisabled,
      ref_app_access_id: permission.id,
   })

   const personDB2UI = (person: PersonDB): PersonUI => ({
      aimlId: person.switchboard_aiml_algorithm_id,
      experimentId: person.ref_experiment_id,
      gppPersonId: person.gpp_person_id,
      sppPersonId: person.spp_person_id,
   })

   const personUI2DB = (person: PersonUI): PersonDB => ({
      gpp_person_id: person.gppPersonId,
      ref_experiment_id: person.experimentId,
      spp_person_id: person.sppPersonId,
      switchboard_aiml_algorithm_id: person.aimlId,
   })

   const pimDB2UI = (pim: PimDB): PimUI => ({
      isSuccess: pim.is_success,
      message: pim.message,
   })

   const roleDB2UI = (role: RoleDB): RoleUI => ({
      description: role.role_desc,
      id: role.ref_role_id,
      isDisabled: role.disabled_flag,
      name: role.role_name,
   })

   const rolePermissionDB2UI = (rolePermission: RolePermissionDB): RolePermissionUI => ({
      permissionId: rolePermission.ref_app_access_id,
      createdBy: rolePermission.row_created_user_id,
      createdOn: rolePermission.row_created_datetime_utc,
      id: rolePermission.role_app_access_id,
      modifiedBy: rolePermission.row_modified_user_id,
      modifiedOn: rolePermission.row_modified_datetime_utc,
      roleId: rolePermission.ref_role_id,
   })

   const roleUI2DB = (role: RoleUI): RoleDB => ({
      disabled_flag: role.isDisabled,
      dp_request_access_flag: false,
      ref_role_id: role.id,
      role_desc: role.description,
      role_name: role.name,
   })

   const textDB2UI = (text: TextDB): TextUI => ({
      aimlId: text.switchboard_aiml_algorithm_id,
      clickedOn: text.recipient_clicked_datetime_utc,
      deletedOn: text.deleted_datetime_utc,
      guid: text.sb_intervention_guid,
      personId: text.spp_person_id,
      recipientPhone: text.recipient_phone,
      sendOn: text.scheduled_datetime_utc,
      sendFrom: text.sender_person_ref_user_id,
      senderPhone: text.sender_phone,
      sentOn: text.sent_datetime_utc,
      textTemplateId: text.ref_mode_text_id,
   })

   const textTemplateDB2UI = (textTemplate: TextTemplateDB): TextTemplateUI => ({
      aimlId: textTemplate.switchboard_aiml_algorithm_id,
      createdBy: textTemplate.row_created_user_id,
      createdOn: textTemplate.row_created_datetime_utc,
      experimentId: textTemplate.ref_experiment_id,
      id: textTemplate.ref_mode_text_id,
      message: textTemplate.text_message,
      modifiedBy: textTemplate.row_modified_user_id,
      modifiedOn: textTemplate.row_modified_datetime_utc,
      sendOn: textTemplate.send_on_datetime_utc,
      weight: textTemplate.weight,
   })

   const textTemplateTagDB2UI = (textTemplateTag: TextTemplateTagDB): TextTemplateTagUI => ({
      createdBy: textTemplateTag.row_created_user_id,
      createdOn: textTemplateTag.row_created_datetime_utc,
      id: textTemplateTag.mode_text_tag_id,
      messageTagId: textTemplateTag.ref_mode_tag_id,
      modifiedBy: textTemplateTag.row_modified_user_id,
      modifiedOn: textTemplateTag.row_modified_datetime_utc,
      textTemplateId: textTemplateTag.ref_mode_text_id,
   })

   const textTemplateTagUI2DB = (textTemplateTag: TextTemplateTagUI): TextTemplateTagDB => ({
      mode_text_tag_id: textTemplateTag.id,
      ref_mode_tag_id: textTemplateTag.messageTagId,
      ref_mode_text_id: textTemplateTag.textTemplateId,
      row_created_datetime_utc: textTemplateTag.createdOn,
      row_created_user_id: textTemplateTag.createdBy,
      row_modified_datetime_utc: textTemplateTag.modifiedOn,
      row_modified_user_id: textTemplateTag.modifiedBy,
   })

   const textTemplateUI2DB = (textTemplate: TextTemplateUI): TextTemplateDB => ({
      ref_experiment_id: textTemplate.experimentId,
      ref_mode_text_id: textTemplate.id,
      row_created_datetime_utc: textTemplate.createdOn,
      row_created_user_id: textTemplate.createdBy,
      row_modified_datetime_utc: textTemplate.modifiedOn,
      row_modified_user_id: textTemplate.modifiedBy,
      send_on_datetime_utc: textTemplate.sendOn,
      switchboard_aiml_algorithm_id: textTemplate.aimlId,
      text_message: textTemplate.message,
      weight: textTemplate.weight,
   })

   const textUI2DB = (text: TextUI): TextDB => ({
      deleted_datetime_utc: text.deletedOn,
      recipient_clicked_datetime_utc: text.clickedOn,
      recipient_phone: text.recipientPhone,
      ref_mode_text_id: text.textTemplateId,
      sb_intervention_guid: text.guid,
      scheduled_datetime_utc: text.sendOn,
      sender_person_ref_user_id: text.sendFrom,
      sender_phone: text.senderPhone,
      sent_datetime_utc: text.sentOn,
      spp_person_id: text.personId,
      switchboard_aiml_algorithm_id: text.aimlId,
   })

   const userDB2UI = (user: UserDB): UserUI => ({
      accountVerifiedOn: user.account_verified_datetime_utc,
      avatarUrl: user.avatar_url,
      createdBy: user.row_created_by_user_name,
      disabledOn: user.disabled_datetime_utc,
      email: user.email,
      firstName: user.first_name,
      id: user.ref_user_id,
      isAccountVerified: user.account_verified_flag,
      isDisabled: user.disabled_flag,
      lastName: user.last_name,
      middleName: user.middle_name,
      modifiedBy: user.row_modified_by_user_name,
      ssoObjectId: user.sso_object_id,
   })

   const userDemographicDB2UI = (userDemographic: UserDemographicDB): UserDemographicUI => ({
      createdBy: userDemographic.row_created_user_id,
      createdByName: userDemographic.row_created_by_user_name,
      createdOn: userDemographic.row_created_datetime_utc,
      demographicId: userDemographic.ref_demographic_id,
      description: userDemographic.demographic_desc,
      disabledOn: userDemographic.disabled_datetime_utc,
      format: userDemographic.data_format,
      id: userDemographic.user_demographic_id,
      isDisabled: userDemographic.disabled_flag,
      isRequired: userDemographic.required_field_flag,
      label: userDemographic.demographic_label,
      length: userDemographic.data_length,
      modifiedBy: userDemographic.row_modified_user_id,
      modifiedByName: userDemographic.row_modified_by_user_name,
      modifiedOn: userDemographic.row_modified_datetime_utc,
      name: userDemographic.demographic_name,
      type: userDemographic.data_type,
      userId: userDemographic.ref_user_id,
      value: userDemographic.demographic_value,
   })

   const userDemographicUI2DB = (userDemographic: UserDemographicUI): UserDemographicDB => ({
      data_format: userDemographic.format,
      data_length: userDemographic.length,
      data_type: userDemographic.type,
      demographic_desc: userDemographic.description,
      demographic_label: userDemographic.label,
      demographic_name: userDemographic.name,
      demographic_value: userDemographic.value,
      disabled_datetime_utc: userDemographic.disabledOn,
      disabled_flag: userDemographic.isDisabled,
      ref_demographic_id: userDemographic.demographicId,
      ref_user_id: userDemographic.userId,
      required_field_flag: userDemographic.isRequired,
      row_created_by_user_name: userDemographic.createdByName,
      row_created_datetime_utc: userDemographic.createdOn,
      row_created_user_id: userDemographic.createdBy,
      row_modified_by_user_name: userDemographic.modifiedByName,
      row_modified_datetime_utc: userDemographic.modifiedOn,
      row_modified_user_id: userDemographic.modifiedBy,
      user_demographic_id: userDemographic.id,
   })

   const userUI2DB = (user: UserUI): UserDB => ({
      account_verified_datetime_utc: user.accountVerifiedOn,
      account_verified_flag: user.isAccountVerified,
      avatar_url: user.avatarUrl,
      disabled_datetime_utc: user.disabledOn,
      disabled_flag: user.isDisabled,
      email: user.email,
      first_name: user.firstName,
      last_name: user.lastName,
      middle_name: user.middleName,
      ref_user_id: user.id,
      row_created_by_user_name: user.createdBy,
      row_modified_by_user_name: user.modifiedBy,
      sso_object_id: user.ssoObjectId,
   })

   const userRoleDB2UI = (userRole: UserRoleDB): UserRoleUI => ({
      disabledOn: userRole.disabled_datetime_utc,
      id: userRole.user_role_id,
      isDisabled: userRole.disabled_flag,
      roleDescription: userRole.role_desc,
      roleId: userRole.ref_role_id,
      roleName: userRole.role_name,
      userId: userRole.ref_user_id,
   })

   const userRoleUI2DB = (userRole: UserRoleUI): UserRoleDB => ({
      disabled_datetime_utc: userRole.disabledOn,
      disabled_flag: userRole.isDisabled,
      ref_role_id: userRole.roleId,
      ref_user_id: userRole.userId,
      role_desc: userRole.roleDescription,
      role_name: userRole.roleName,
      user_role_id: userRole.id,
   })

   return {
      audienceMember: {
         DB2UI: audienceMemberDB2UI,
         UI2DB: audienceMemberUI2DB,
      },
      campaign: {
         DB2UI: campaignDB2UI,
         UI2DB: campaignUI2DB,
      },
      campaignTag: {
         DB2UI: campaignTagDB2UI,
         UI2DB: campaignTagUI2DB,
      },
      campaignTagRelationship: {
         DB2UI: campaignTagRelationshipDB2UI,
         UI2DB: campaignTagRelationshipUI2DB,
      },
      cohort: {
         DB2UI: cohortDB2UI,
         UI2DB: cohortUI2DB,
      },
      email: {
         DB2UI: emailDB2UI,
         UI2DB: emailUI2DB,
      },
      emailTemplate: {
         DB2UI: emailTemplateDB2UI,
         UI2DB: emailTemplateUI2DB,
      },
      emailTemplateTag: {
         DB2UI: emailTemplateTagDB2UI,
         UI2DB: emailTemplateTagUI2DB,
      },
      experiment: {
         DB2UI: experimentDB2UI,
         UI2DB: experimentUI2DB,
      },
      experimentTag: {
         DB2UI: experimentTagDB2UI,
         UI2DB: experimentTagUI2DB,
      },
      experimentTagRelationship: {
         DB2UI: experimentTagRelationshipDB2UI,
         UI2DB: experimentTagRelationshipUI2DB,
      },
      hypothesis: {
         DB2UI: hypothesisDB2UI,
         UI2DB: hypothesisUI2DB,
      },
      inAppMessage: {
         DB2UI: inAppMessageDB2UI,
         UI2DB: inAppMessageUI2DB,
      },
      inAppMessageTemplate: {
         DB2UI: inAppMessageTemplateDB2UI,
         UI2DB: inAppMessageTemplateUI2DB,
      },
      inAppMessageTemplateTag: {
         DB2UI: inAppMessageTemplateTagDB2UI,
         UI2DB: inAppMessageTemplateTagUI2DB,
      },
      messageTag: {
         DB2UI: messageTagDB2UI,
         UI2DB: messageTagUI2DB,
      },
      patch: {
         UI2DB: patchUI2DB,
      },
      permission: {
         DB2UI: permissionDB2UI,
         UI2DB: permissionUI2DB,
      },
      person: {
         DB2UI: personDB2UI,
         UI2DB: personUI2DB,
      },
      pim: {
         DB2UI: pimDB2UI,
      },
      role: {
         DB2UI: roleDB2UI,
         UI2DB: roleUI2DB,
      },
      rolePermission: {
         DB2UI: rolePermissionDB2UI,
      },
      text: {
         DB2UI: textDB2UI,
         UI2DB: textUI2DB,
      },
      textTemplate: {
         DB2UI: textTemplateDB2UI,
         UI2DB: textTemplateUI2DB,
      },
      textTemplateTag: {
         DB2UI: textTemplateTagDB2UI,
         UI2DB: textTemplateTagUI2DB,
      },
      user: {
         DB2UI: userDB2UI,
         UI2DB: userUI2DB,
      },
      userDemographic: {
         DB2UI: userDemographicDB2UI,
         UI2DB: userDemographicUI2DB,
      },
      userRole: {
         DB2UI: userRoleDB2UI,
         UI2DB: userRoleUI2DB,
      },
   }
})();