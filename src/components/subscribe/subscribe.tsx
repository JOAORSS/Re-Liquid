import { injectLiquidRaw } from "../../util/shopify";
import type { Settings } from "./subscribe.types";
import "./subscribe.css";

export function Subscribe(props: { settings: Settings }) {

    const form = injectLiquidRaw<string>(`
        {% form 'customer' %}
            {{ form.errors | default_errors }}
            {% if form.posted_successfully? %}
                <p class="newsletter__success">Thanks for subscribing!</p>
            {% else %}
                <div class="newsletter">
                    <label for="NewsletterEmail">Email</label>
                    <input
                        id="NewsletterEmail"
                        type="email"
                        name="contact[email]"
                        value="{{ form.email }}"
                        required
                    >
                    <button type="submit">Sign up</button>
                </div>
            {% endif %}
        {% endform %}
    `);

    return (
        <section className="subscribe">
            <h2 className="title">{props.settings.title}</h2>
            <p className="description">{props.settings.description}</p>

            <div dangerouslySetInnerHTML={{ __html: form }} />
        </section>
    );
}