export { 
  ClientLoginScreen, 
  ClientHomeScreen, 
  ClientSearchScreen, 
  ClientReservationsScreen, 
  ClientChatScreen, 
  ClientProfileScreen, 
  ClientEditProfileScreen,
  RequestServiceScreen,
} from './ClientScreens';

// Re-export detail/chat screens that live in professional module
export { ProfessionalDetailScreen, ChatDetailScreen } from '../professional/ProfessionalScreens';
