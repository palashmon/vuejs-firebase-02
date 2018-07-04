import Vue from 'vue';
import Router from 'vue-router';
const Home = () => import('@/components/Home');
const Meetups = () => import('@/components/Meetup/Meetups');
const CreateMeetup = () => import('@/components/Meetup/CreateMeetup');
const Profile = () => import('@/components/User/Profile');
const Signup = () => import('@/components/User/Signup');
const Signin = () => import('@/components/User/Signin');
const Meetup = () => import('@/components/Meetup/Meetup');

Vue.use(Router);
export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/meetups',
      name: 'Meetups',
      component: Meetups
    },
    {
      path: '/meetup/new',
      name: 'CreateMeetup',
      component: CreateMeetup
    },
    {
      path: '/meetups/:id',
      name: 'Meetup',
      props: true,
      component: Meetup
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    },
    {
      path: '/signin',
      name: 'Signin',
      component: Signin
    }
  ],
  mode: 'history'
});
