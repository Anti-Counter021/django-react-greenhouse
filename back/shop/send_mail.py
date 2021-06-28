from django.core.mail import mail_managers
from django.template.loader import render_to_string


def send_manager_about_new_order(order):
    """ Отправка email о новом заказе """

    context = {'order': order}
    subject = render_to_string('subject.txt')
    body = render_to_string('body.txt', context)
    mail_managers(subject, body)
