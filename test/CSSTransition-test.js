import React from 'react';
import { mount } from 'enzyme';

import CSSTransition from '../src/CSSTransition';

jasmine.addMatchers({
  toExist: () => ({
    compare: actual => ({
      pass: actual != null,
    })
  })
});

describe('CSSTransition', () => {

  it('should flush new props to the DOM before initiating a transition', (done) => {
    mount(
      <CSSTransition
        in={false}
        timeout={0}
        classNames="test"
        onEnter={node => {
          expect(node.classList.contains('test-class')).toEqual(true)
          expect(node.classList.contains('test-entering')).toEqual(false)
          done()
        }}
      >
        <div></div>
      </CSSTransition>
    )
    .tap(inst => {

      expect(inst.getDOMNode().classList.contains('test-class')).toEqual(false)
    })
    .setProps({
      in: true,
      className: 'test-class'
    })
  });

  describe('entering', () => {
    let instance;

    beforeEach(() => {
      instance = mount(
        <CSSTransition
          timeout={10}
          classNames="test"
        >
          <div/>
        </CSSTransition>
      )
    });

    it('should apply classes at each transition state', done => {
      let count = 0;

      instance.setProps({
        in: true,

        onEnter(node) {
          count++;
          expect(node.className).toEqual('test-enter');
        },

        onEntering(node){
          count++;
          expect(node.className).toEqual('test-enter test-enter-active');
        },

        onEntered(node){
          expect(node.className).toEqual('test-enter-done');
          expect(count).toEqual(2);
          done();
        }
      });
    });

    it('should apply custom classNames names', done => {
      let count = 0;
      instance = mount(
        <CSSTransition
          timeout={10}
          classNames={{
            enter: 'custom',
            enterActive: 'custom-super-active',
            enterDone: 'custom-super-done',
          }}
        >
          <div/>
        </CSSTransition>
      );

      instance.setProps({
        in: true,

        onEnter(node){
          count++;
          expect(node.className).toEqual('custom');
        },

        onEntering(node){
          count++;
          expect(node.className).toEqual('custom custom-super-active');
        },

        onEntered(node){
          expect(node.className).toEqual('custom-super-done');
          expect(count).toEqual(2);
          done();
        }
      });
    });
  });

  describe('appearing', () => {
    it('should apply appear classes at each transition state', done => {
      let count = 0;
      mount(
        <CSSTransition
          timeout={10}
          classNames='appear-test'
          in={true}
          appear={true}
          onEnter={(node, isAppearing) => {
            count++;
            expect(isAppearing).toEqual(true);
            expect(node.className).toEqual('appear-test-appear');
          }}
          onEntering={(node, isAppearing) => {
            count++;
            expect(isAppearing).toEqual(true);
            expect(node.className).toEqual('appear-test-appear appear-test-appear-active');
          }}

          onEntered={(node, isAppearing) => {
            expect(isAppearing).toEqual(true);
            expect(node.className).toEqual('appear-test-enter-done');
            expect(count).toEqual(2);
            done();
          }}
        >
          <div/>
        </CSSTransition>
      );
    });

    it('should not be appearing in normal enter mode', done => {
      let count = 0;
      mount(
        <CSSTransition
          timeout={10}
          classNames='not-appear-test'
          appear={true}
        >
          <div/>
        </CSSTransition>
      ).setProps({
        in: true,

        onEnter(node, isAppearing){
          count++;
          expect(isAppearing).toEqual(false);
          expect(node.className).toEqual('not-appear-test-enter');
        },

        onEntering(node, isAppearing){
          count++;
          expect(isAppearing).toEqual(false);
          expect(node.className).toEqual('not-appear-test-enter not-appear-test-enter-active');
        },

        onEntered(node, isAppearing){
          expect(isAppearing).toEqual(false);
          expect(node.className).toEqual('not-appear-test-enter-done');
          expect(count).toEqual(2);
          done();
        }
      });
    });

    it('should not enter the transition states when appear=false', () => {
      mount(
        <CSSTransition
          timeout={10}
          classNames='appear-fail-test'
          in={true}
          appear={false}
          onEnter={() => {
            throw Error('Enter called!')
          }}
          onEntering={() => {
            throw Error('Entring called!')
          }}
          onEntered={() => {
            throw Error('Entred called!')
          }}
        >
          <div/>
        </CSSTransition>
      );
    });


  });

  describe('exiting', ()=> {
    let instance;

    beforeEach(() => {
      instance = mount(
        <CSSTransition
          in
          timeout={10}
          classNames="test"
        >
          <div/>
        </CSSTransition>
      )
    });

    it('should apply classes at each transition state', done => {
      let count = 0;

      instance.setProps({
        in: false,

        onExit(node){
          count++;
          expect(node.className).toEqual('test-exit');
        },

        onExiting(node){
          count++;
          expect(node.className).toEqual('test-exit test-exit-active');
        },

        onExited(node){
          expect(node.className).toEqual('test-exit-done');
          expect(count).toEqual(2);
          done();
        }
      });
    });

    it('should apply custom classNames names', done => {
      let count = 0;
      instance = mount(
        <CSSTransition
          in
          timeout={10}
          classNames={{
            exit: 'custom',
            exitActive: 'custom-super-active',
            exitDone: 'custom-super-done',
          }}
        >
          <div/>
        </CSSTransition>
      );

      instance.setProps({
        in: false,

        onExit(node){
          count++;
          expect(node.className).toEqual('custom');
        },

        onExiting(node){
          count++;
          expect(node.className).toEqual('custom custom-super-active');
        },

        onExited(node){
          expect(node.className).toEqual('custom-super-done');
          expect(count).toEqual(2);
          done();
        }
      });
    });
  });
});
