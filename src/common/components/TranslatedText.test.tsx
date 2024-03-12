import { cleanup, render, screen } from '@testing-library/react';
import { initiateTranslations } from '../../app/functions/initiateTranslations';
import { HtmlElement } from '../enums/HtmlElement';
import { TranslatedText } from './TranslatedText';
import '@testing-library/jest-dom';

describe('<TranslatedText> component', () => {
   beforeEach(initiateTranslations);
   afterEach(cleanup);

   it('renders a <span> tag by default', () => {
      render(
         <TranslatedText text={'This is for the unit tests.'}/>
      )
      const spans = document.getElementsByTagName('span');
      expect(spans.length).toEqual(1);
   })

   it('renders element props, and a <div> tag when called for, and translated text', () => {
      render(
         <TranslatedText
            elementProps={{
               'data-testid': 'test',
               id: 'test',
            }}
            elementType={HtmlElement.div}
            text={'This is for the unit tests.'}
         />
      )
      const div = document.getElementById('test');
      expect(div?.tagName).toEqual('DIV');
      expect(screen.getByText('This is for the unit tests.')).toBeInTheDocument();
   })
})