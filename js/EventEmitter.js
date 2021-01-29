export default class EventEmitter
{
    constructor()
    {
        // Clé : nom de l'évènement, valeur : tableau de callbacks
        this.callbacks = new Map();
    }

    // Ajout d'une callback liée à un évènement en particulier
    on(eventName, callback)
    {
        // Si la liste de callbacks pour cet évènement n'existe pas, on la créé
        if (!this.callbacks.has(eventName))
        {
            this.callbacks.set(eventName, []);
        }

        // Ajout de la callback à la liste
        const callbacksList = this.callbacks.get(eventName);
        callbacksList.push(callback);

        return this;
    }

    emit(eventName, ...params)
    {
        // On appelle toutes les callbacks en passant les paramètres
        if (this.callbacks.has(eventName))
        {
            const callbacksList = this.callbacks.get(eventName);

            for (const callback of callbacksList)
            {
                callback(...params);
            }
        }

        return this;
    }
}