import { Box, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { Topic } from '../enums/Topic';
import { useViewport } from '../hooks/useViewport';
import type { GenericFunction } from '../types/GenericFunction';
import type { GenericObject } from '../types/GenericObject';
import { SlidingDialog } from './SlidingDialog';
import { TranslatedText } from './TranslatedText';

interface Props {
   onClose: GenericFunction,
   open: boolean,
   topic: Topic,
}

export const HelpDialog = ({ onClose, open, topic }: Props) => {
   const viewport = useViewport();
   const { t: translate } = useTranslation();

   const boxStyle = {
      fontSize: '0.9em',
      marginBottom: 2,
      textAlign: 'justify',
   }
   const h4Style = {
      marginBottom: 0,
      marginTop: 0,
   }
   const content: GenericObject = {
      audiences: {
         body: <>
            <h4 style={h4Style}>
               Why is the audience size <i>approximate</i>?
            </h4>
            <Box sx={boxStyle}>
               When you configure an experiment and create your cohorts, an initial audience is built with the intention of giving you an immediate estimate of what
               that audience would look like. However, at the point in time when experiment messages are actually sent, <i>the audience is rebuilt</i> using the rules
               defined for each cohort. Why is this?
            </Box>
            <Box sx={boxStyle}>
               Imagine that today is February 1st and you are creating a new experiment to be run in the future. The experiment will send its messages on March 1st and
               you want to send those messages to all Community users who have logged in at any point during the past week. This means that you would create a cohort
               to send to everyone in the Community User Logins table where the Last Login Time column is <i>greater than</i> February 21st. Because,
               at the time that the messages are sent (March 1st), everyone who's logged in during the past week will be defined as those having a Last Login Time greater
               than February 21st.
            </Box>
            <Box sx={boxStyle}>
               But on the day when you first configure the experiment (February 1st), the number of people whose last login date is greater than February 21st is... 0. Of
               course, if you configure your message sends to happen very shortly after the time when you first configure the experiment, then there's a greater likelihood
               that your "approximate" audience size will end up being very close - or identical - to your <i>actual</i> audience size at the time when the messages are sent.
               But for most cohorts, there is at least some chance that the initial, <i>approximate</i> audience size will be at least somewhat different from the
               <i>actual</i> audience size calculated when the message sends are triggered.
            </Box>
         </>,
         title: <>Audiences</>,
      },
      bodyFields: {
         body: <>
            <h4 style={h4Style}>
               What's the difference between the Text Body field and the HTML Body field?
            </h4>
            <Box sx={boxStyle}>
               Text Body represents what will be seen by the recipient if their email client <i>cannot</i> render HTML. HTML Body represents what will be seen
               by the recipient if their email client <i>can</i> render HTML.
            </Box>
            <h4 style={h4Style}>
               But I'm not trying to send <i>text-based</i> emails. I'm trying to send <i>HTML</i> emails.
            </h4>
            <Box sx={boxStyle}>
               Yes, but email specs indicate that you should always send an HTML version <i>and</i> a text version. The text version is a "fallback" that's
               only used if, for some reason, the recipient can't render HTML in their email client.
            </Box>
            <h4 style={h4Style}>
               Will the recipient see <i>both</i> the text version and the HTML version?
            </h4>
            <Box sx={boxStyle}>
               No. Email clients will only show one version. Assuming that the client is capable of rendering HTML, the recipient will only ever see the version
               that you save under HTML Body. They only see the text version if their client does not have the ability to render HTML.
            </Box>
            <h4 style={h4Style}>
               What happens if I include HTML/CSS in the Text Body field?
            </h4>
            <Box sx={boxStyle}>
               It won't "break" anything - but neither will it lead to a satisfying experience for the recipient.  If HTML/CSS markup exists in the Text Body field,
               the recipient will see all of that markup as plain text (which makes it nearly impossible to find the raw content in the message).
            </Box>
         </>,
         title: <>Body Fields</>,
      },
      endDates: {
         body: <>
            <h4 style={h4Style}>
               Will the experiment continue to send messages until the Ends On value?
            </h4>
            <Box sx={boxStyle}>
               No. Messages are only ever sent at the dates/times that you configure on the individual message templates. So if the last template on your
               experiment is configured to send at midnight on June 1st, but the experiment ends on July 1st, there will be no messages sent between June 1st and
               July 1st.
            </Box>
            <h4 style={h4Style}>
               Wouldn't the effective "end date" for the experiment simply be the date when the last message is sent out?
            </h4>
            <Box sx={boxStyle}>
               No. The Observing stage is that period between the last message send and the end of the experiment.  The purpose of the Observing stage is to
               monitor the recipients and see if they completed the activity that was defined as the experiment's goal.  For example: You configure an experiment
               to send a message to everyone in the Community who hasn't logged in for a month, and you set the Goal to "User logs into the Community".  You
               schedule the message to send at midnight on June 1st and the experiment ends on July 1st.  This means that the metrics for the experiment (e.g.,
               Did they ever log back into the Community app?) will be monitored from June 1st until July 1st.
            </Box>
         </>,
         title: <>End Dates</>,
      },
      sendFromValues: {
         body: <>
            <h4 style={h4Style}>
               Do I always need to supply send-from values?
            </h4>
            <Box sx={boxStyle}>
               No. They are only required if you are using one-or-more in-app message templates.
            </Box>
            <h4 style={h4Style}>
               Why can't I just enter an email address from which the messages should be sent?
            </h4>
            <Box sx={boxStyle}>
               As the name implies, an in-app message is one that is sent <i>inside</i> the Lore app. As such, you aren't really sending from a given email address
               to another email address. Instead, you're sending from one user to another.
            </Box>
            <h4 style={h4Style}>
               Why do I need to manually supply a Display Name?
            </h4>
            <Box sx={boxStyle}>
               Even though in-app messages are sent from user-to-user, the Lore account from which you're sending may be a "team" account and you may want to
               customize the Display Name to something more personal - or something that reflects the content in the sent message.  For example: You may be sending
               from the Lore Team account, but you may still want the Display Name to reflect your name or the name of someone else on your team.  Or you may want to
               use a different "generic" Display Name - like, changing "Lore Team" to "Customer Service".
            </Box>
         </>,
         title: <>Send-From Values</>,
      },
      sentMessages: {
         body: <>
            <h4 style={h4Style}>
               Why is this tab empty?
            </h4>
            <Box sx={boxStyle}>
               This tab shows a history of all the messages that have <i>already been sent</i> on this experiment. If there are no messages that have yet been sent
               for this experiment, then this tab will be empty.
            </Box>
            <h4 style={h4Style}>
               How do I make the messages send?
            </h4>
            <Box sx={boxStyle}>
               Every message is derived from a template.  So first, you need to ensure that you've configured at least one template on the TEMPLATES tab.  Once
               you've configured at least one template, the messages will be sent at the time that is configured in each template's Send On value.  So if today
               is March 1st, and you've configured one template that sends on midnight of March 7th, then you won't see anything in the MESSAGES tab until after
               midnight on March 7th.
            </Box>
         </>,
         title: <>Messages</>,
      },
      stages: {
         body: <>
            <h4 style={h4Style}>
               What do the stages mean?
            </h4>
            <Box sx={boxStyle}>
               <ul>
                  <li>
                     <b>Unscheduled</b>
                     <br/>
                     All experiments start in the Unscheduled stage. "Unscheduled" means that no message sends have been configured for this experiment. To move your
                     experiment out of the Unscheduled stage, you will need to add at least one message template.
                  </li>
                  <br/>
                  <li>
                     <b>Scheduled</b>
                     <br/>
                     A Scheduled experiment has at least one message template, but it has not yet sent any messages. For example: If today is March 1st and you add
                     one message template to the experiment, which will send on March 15th at midnight, then the experiment will remain in the Scheduled stage until
                     March 15th at midnight.
                  </li>
                  <br/>
                  <li>
                     <b>Sending</b>
                     <br/>
                     An experiment in the Sending stage has started sending messages - but has not yet finished. If your experiment only uses a single message template,
                     or if all the message templates send at the same time, then you will never see the experiment in the Sending stage. It will move from the Scheduled
                     stage to the Observing stage in a nearly-instantaneous manner.
                     <br/><br/>
                     You are most likely to see an experiment in the Sending stage when it has two-or-more message templates that are scheduled to send at significantly
                     different times. For example: If an experiment has two templates, with the first set to send on March 1st at midnight, and the second set to send
                     on March 8th at midnight, then it will be in a Sending stage from midnight on March 1st until midnight on March 8th.
                  </li>
                  <br/>
                  <li>
                     <b>Observing</b>
                     <br/>
                     An experiment is in the Observing stage when all of its messages have been sent, but the end date has not passed. The purpose of this stage
                     is to watch the activity of those users who have been messaged to see if they have completed a certain goal. For example: Imagine that your
                     experiment has a goal of "User logs into Community" and it has an end date of March 31st. You target an audience of everyone who hasn't logged
                     in since March 1st. You set several different messages to be sent to these people on March 7th. Then the period between March 7th and March 31st
                     is when the experiment will be in the Observing stage. Essentially, those recipients are being <i>observed</i> to see whether the messages they've
                     received have in fact resulted in them logging back into Community.
                  </li>
                  <br/>
                  <li>
                     <b>Concluded</b>
                     <br/>
                     A Concluded experiment is any experiment for which the end date has passed.
                  </li>
               </ul>
            </Box>
            <h4 style={h4Style}>
               How do you move an experiment through the stages?
            </h4>
            <Box sx={boxStyle}>
               You don't manually set a stage or push a button to advance/retreat it through the stages. The stages are defined by activity on the experiment itself.
               These activities are configured by the user, but the system moves an experiment through the stages automatically based on those values.
            </Box>
            <h4 style={h4Style}>
               How do you know which stage an experiment is in?
            </h4>
            <Box sx={boxStyle}>
               Completed stages are shown in green.  The current stage is in black, and it's in an outlined box.  Future stages are shown in grey.
            </Box>
         </>,
         title: <>Stages</>,
      },
      utc: {
         body: <>
            <h4 style={h4Style}>
               What is UTC?
            </h4>
            <Box sx={boxStyle}>
               It means "Coordinated Universal Time". It's the primary time standard used globally to regulate timed events across time zones. When Switchboard
               references "UTC", it's specifically talking about <i>UTC+00:00</i> - or, in other words, UTC time with no time zone offsets. In practical terms, the
               UTC time shown in Switchboard usually represents the time at-or-near England.
            </Box>
            <h4 style={h4Style}>
               So UTC is the equivalent of Greenwich Mean Time (GMT)?
            </h4>
            <Box sx={boxStyle}>
               Not exactly. GMT is the local time at the Royal Observatory in Greenwich, London. This can differ from UTC when England is observing daylight savings
               time. So UTC+00:00 is consistent year-round.
            </Box>
            <h4 style={h4Style}>
               When does Switchboard use UTC? And when does it use my local time?
            </h4>
            <Box sx={boxStyle}>
               Switchboard only ever uses UTC. On the Templates tab, your current local time is displayed to help you understand the difference. But experiment
               Ends On, and all template Send On dates/times, use UTC.  Furthermore, all Switchboard times are displayed on a 24-hour clock.  This means that
               1:00PM will actually display as 13:00, 5:30PM will display as 17:30, etc.
            </Box>
            <h4 style={h4Style}>
               Can't we just use <i>local</i> time?
            </h4>
            <Box sx={boxStyle}>
               The problem is that "local time" is different for many team members across a wide array of time zones.  You may have team members on the east coast,
               the west coast, anywhere in the middle of the country, or even in other countries throughout the world (e.g., Philippines, India, Egypt).  UTC
               helps to avoid confusing time references.  For example: If you tell everyone that you're going to send out a new set of messages "at noon",{' '}
               <i>your</i> noon could be entirely different from everyone else's.  To avoid this confusion, all dates/times in Switchboard use UTC+00:00.  So if you
               say that you're sending those messages at 12:00 <i>UTC time</i>, everyone can accurately understand exactly when those messages will be sent -
               regardless of their particular location in the world.
            </Box>
         </>,
         title: <>UTC</>,
      },
      weights: {
         body: <>
            <h4 style={h4Style}>
               What is a "weight"?
            </h4>
            <Box sx={boxStyle}>
               The weight determines how likely each recipient is to receive the message generated from a given template. The default weight for every template
               is 1. If every template on an experiment has a weight of 1, then the messages will be equally distributed amongst all recipients. For example: If
               there are 300 people in the audience, and there are 3 message templates configured on the experiment, and each template has a weight of 1, then
               100 recipients will receive the message configured in the first template, 100 will receive the message configured in the second template, and
               100 will receive the message configured in the third template.
            </Box>
            <h4 style={h4Style}>
               What is the relationship between the weight and the percentage?
            </h4>
            <Box sx={boxStyle}>
               Percentages are calculated based upon each template's weight <i>in relation to the weight of all other templates on the experiment</i>.  Another
               way to think of the weight is as a <i>ratio</i>.  In other words, in the example given above the total weight for all 3 experiments is: 3.  The
               ratio of messages sent using the first template is 1/3 (100 recipients).  The ratio of messages sent using the second template is 1/3 (100
               recipients).  And the ratio of messages sent using the third template is also 1/3 (100 recipients).
               <br/><br/>
               If you change the weight of a template, that changes the <i>ratio</i> of recipients who will be messaged with that template.  For example:  If
               there are 300 people in the audience, and there are 3 message templates configured on the experiment, and the <i>first</i> template has a weight of 2,
               and the other two templates each have a weight of 1, this means that 2/4 (50%) of all recipients will receive template #1, 1/4 (25%) will receive
               template #2, and 1/4 (25%) will receive template #3.
            </Box>
         </>,
         title: <>Weights</>,
      },
   }

   const close = () => onClose();

   return <SlidingDialog
      actions={
         <Button
            aria-label={translate('Close')}
            onClick={close}
            variant={'outlined'}
         >
            <TranslatedText text={'Close'}/>
         </Button>
      }
      content={content[topic].body}
      dialogProps={{
         sx: {
            '& .MuiDialog-container': {
               '& .MuiPaper-root': {
                  height: '100%',
                  maxHeight: viewport.isMobile ? '120vh' : '80vh',
                  maxWidth: viewport.isMobile ? '120vw' : '50vw',
                  width: '100%',
               },
            },
         },
      }}
      onClose={close}
      open={open}
      title={content[topic].title}
   />
}