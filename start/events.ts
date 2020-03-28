import Event from '@ioc:Adonis/Core/Event'

Event.on('user:registration', 'UserListener.registration')
Event.on('user:recover', 'UserListener.recover')
