import { Canister, Principal, int, query, Record, Variant, Result, StableBTreeMap, text, update, ic, Vec, Err } from 'azle';

const Vote = Record({
    voteCreator: Principal,
    lastname1: text,
    lastname2: text,
    names: text,
    voting: int
});

const VoteError = Variant({
    VoteInvalidValue: Principal
});

let votes = StableBTreeMap(Principal, Vote, 0);

//Declaramos id como global para crear una función de busqueda

export default Canister({

    
    getVote: query([Principal], Result(Vote, VoteError), (id) => {
        const voteOpt = votes.get(id);
        return voteOpt;
    }),
    createVote: update([text, text, text, int], Vote, (lastname1, lastname2, names, voting ) => {

        const id = generateId();
        const vote: typeof Vote = {
            voteCreator: ic.caller,
            lastname1: text,
            lastname2: text,
            names: text,
            voting: int
        
        };
        /*if ('Null' in vote.id) {
            return Err({
                VoteInvalidValue: id
            });
        }else{*/
            votes.insert(id, vote);
            console.log(`New vote created! ID:`, id);
            return vote;
        //}
    
    }),
    updateVote: update([text, text, text, int], Vote, (lastname1, lastname2, names, voting) => {
                const vote = Vote.Some;
                const newVote: typeof Vote = {
                    ...vote,
                    lastname1,
                    lastname2,
                    names,
                    voting
                };
                /*if ('Null' in vote.id) {
                    return Err({
                        VoteInvalidValue: id
                    });
                }else{*/
                    if ( newVote.voting<=0 ) {
                        votes.insert(id, newVote);
                
                        console.log(`Vote Modified! ID:`, id);
                        return vote;
                    }else{
                        countVote: query([], Vec(Vote), () => {
                            let candidates = [0,0];
                            Vote.foreach(function (votes) {
                                if(votes.voting==1) ++candidates[0];
                                if(votes.voting==2) ++candidates[1];
                            });
                            return candidates;
                        })
                    }

                //}
                
            })
})
function generateId(): Principal {
    const randomBytes = new Array(13)
        .fill(0)
        .map((_) => Math.floor(Math.random() * 256));

    return Principal.fromUint8Array(Uint8Array.from(randomBytes));
}